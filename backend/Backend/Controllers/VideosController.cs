﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using NuGet.DependencyResolver;
using Backend.Utils;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using System.Collections;
using NuGet.Packaging;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Backend.Migrations;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Threading;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        public readonly MyDbContext _context;

        public VideosController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Videos
        /// <summary>
        /// Vrací videa na které má uživatel právo
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetVideos([FromQuery] string? orderBy = null, int? limit = null, int? offset = null)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            IQueryable<Video> query = _context.Videos.Include(x => x.MainPlaylist).AsQueryable().ApplyPermissions(this, _context);

            var sorted = false;
            if (!string.IsNullOrEmpty(orderBy))
            {
                string[] orderByParts = orderBy?.Split(':') ?? Array.Empty<string>();
                if (orderByParts.Length == 0)
                {
                    return BadRequest();
                }
                PropertyInfo propertyInfo = typeof(Video).GetProperty(orderByParts[0], BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                if (propertyInfo != null)
                {
                    if (orderByParts.Length == 2 && orderByParts[1].ToLowerInvariant() == "desc")
                    {
                        query = query.OrderByDescending(x => propertyInfo.GetValue(x));
                    }
                    else
                    {
                        query = query.OrderBy(x => propertyInfo.GetValue(x));
                    }
                    sorted = true;
                }
            }
            if (!sorted)
            {
                query = query.OrderByDescending(x => x.UploadTimestamp);
            }

            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }
            else
            {
                query = query.Take(5);
            }

            if (offset.HasValue)
            {
                query = query.Skip(offset.Value);
            }
            return await query.Select(x => x.ToDTO()).ToListAsync();
        }


        // GET: api/Videos/5
        /// <summary>
        ///  Vrací konkrétní video. V případě že uživatel nemá na video právo je objekt videa s prázdnými daty.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDTO>> GetVideo(Guid id)
        {
            if (_context.Videos == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno.");
            }
            var video = await _context.Videos
                    .Include(x => x.Tags)
                    .Include(x => x.MainPlaylist)
                    .ThenInclude(x => x.Permissions)
                    .Include(x => x.Permissions)
                       .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.Id == id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno.");
            }
            if (!HasPermissions(video))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Na video nemáte oprávnění.");
            }
            return video.ToDTO();
        }

        /// <summary>
        /// Vrací pokročilé nastavení oprávnění k videu
        /// </summary>
        [HttpGet("{id}/video-permissions")]
        public async Task<ActionResult<IncludeExcludeObjectPermissions>> GetVideoPermissions(Guid id)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            if (!HasPermissions(video))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Přístup odepřen");
            }
            var permissions = await _context.Permissions.Where(x => x.VideoId == id).ToListAsync();
            var includedUserPermissions = permissions.Where(x => x.UserId != null && x.OverridedEnableWatch == true).Select(x => x.UserId ?? Guid.Empty).ToList();
            var excludedUserPermissions = permissions.Where(x => x.UserId != null && x.OverridedEnableWatch == false).Select(x => x.UserId ?? Guid.Empty).ToList();
            var includedGroupPermissions = permissions.Where(x => x.UserGroupId != null && x.OverridedEnableWatch == true).Select(x => x.UserGroupId ?? Guid.Empty).ToList();
            var excludedGroupPermissions = permissions.Where(x => x.UserGroupId != null && x.OverridedEnableWatch == false).Select(x => x.UserGroupId ?? Guid.Empty).ToList();
            return new IncludeExcludeObjectPermissions(
                IncludedPermissions:
                    new ObjectPermissions(
                        UserIds: includedUserPermissions,
                        GroupIds: includedGroupPermissions),
                ExcludedPermissions:
                    new ObjectPermissions(
                        UserIds: excludedUserPermissions,
                        GroupIds: excludedGroupPermissions)
                );
        }

        // GET: api/videos/my
        /// <summary>
        /// Vrací videa, která přihlášený uživatel vlastní
        /// </summary>
        /// <returns></returns>
        [HttpGet("my-videos")]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetMyVideos()
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            return await _context.Videos.Where(x => x.Owner.Id == userId).Select(x => x.ToDTO()).ToListAsync();
        }

        /// <summary>
        /// Vrací podobná videa k videu
        /// </summary>
        [HttpGet("{id}/related-videos")]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetRelatedVideos(Guid id)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            if (!HasPermissions(video))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Přístup odepřen");
            }

            var shortedVideoDescription = video?.Description == null ? null : String.Join(' ', video.Description.Split().Take(5));
            var relatedVideos = _context.Videos.FromSql($@"SELECT
                      (MATCH(name) AGAINST('{video.Name}') +
                       MATCH(description) AGAINST('{shortedVideoDescription}')) as Relevance,
                      v.*
                    FROM Videos as v
                    WHERE v.id <> {video.Id}
                    ORDER BY Relevance desc
")
                .AsQueryable().ApplyPermissions(this, _context)
                .Take(10)
                .AsNoTracking()
                .Select(x => x.ToDTO())
                .ToListAsync();
            return await relatedVideos;
        }

        // PUT: api/Videos/5
        /// <summary>
        /// Aktualizuje existující video
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideo(Guid id, [FromForm] ModifyVideoDTO modifiedVideo)
        {
            var video = await _context.Videos.Include(x => x.Tags).Include(x => x.MainPlaylist).ThenInclude(x => x.Videos).FirstOrDefaultAsync(x => x.Id == id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            if (video.Owner != User.GetUser(_context))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Nemáte oprávnění k úpravě videa");
            }
            _context.Entry(video).State = EntityState.Modified;
            video.Name = modifiedVideo.Name;
            video.Description = modifiedVideo.Description;
            if (video.MainPlaylist != null && video.MainPlaylist.Id != modifiedVideo.PlaylistId)
            {
                PlaylistsController.RemoveVideoFromPlaylist(_context, video.MainPlaylist, video);
                video.MainPlaylist = _context.Playlists.Include(x => x.Videos).Single(x => x.Id == modifiedVideo.PlaylistId);
                PlaylistsController.AddVideoToPlaylist(_context, video.MainPlaylist, video);
            }

            if (video.Tags?.Any() ?? false)
            {
                video.Tags.Clear();
            }
            else
            {
                video.Tags = new List<Tag>();
            }
            if (modifiedVideo.Tags?.Any() ?? false)
            {
                _context.Tags.Where(x => modifiedVideo.Tags.Contains(x.Name)).ToList().ForEach(x => video.Tags.Add(x));
            }
            PermissionsController.ClearExistingPermissions(_context, video);
            if ((modifiedVideo.IncludedPermissions?.UserIds?.Any() ?? false) || (modifiedVideo.IncludedPermissions?.GroupIds?.Any() ?? false))
            {
                PermissionsController.SavePermissions(_context, modifiedVideo.IncludedPermissions, video, null, true);
            }
            if ((modifiedVideo.ExcludedPermissions?.UserIds?.Any() ?? false) || (modifiedVideo.ExcludedPermissions?.GroupIds?.Any() ?? false))
            {
                PermissionsController.SavePermissions(_context, modifiedVideo.ExcludedPermissions, video, null, false);
            }
            if (modifiedVideo.Image != null)
            {
                var thumbnailUrl = await SaveThumbnailAsync(modifiedVideo.PlaylistId, modifiedVideo.Image);
                video.ImageUrl = thumbnailUrl;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VideoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Videos
        /// <summary>
        /// Vytvoří video a v odpovědi vrátí dataUrl, které se použije pro nahrání videa pomocí POST /api/videos/upload
        /// </summary>
        [HttpPost]
        [Authorize(Roles = RoleNames.Editor)]
        public async Task<ActionResult<PostVideoResponse>> PostVideo([FromForm] PostVideoRequest video)
        {
            if (_context.Videos == null)
            {
                return Problem();
            }
            var user = User.GetUser(_context);
            if (video.PlaylistId == user.WatchLaterPlaylistId)
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Nelze nahrávat videa do playlistu přehrát později");
            }

            // upload video
            var videoGuid = $"{video.PlaylistId}{Guid.NewGuid()}";
            var videoName = $"{videoGuid}.{video.FileName.Split(".").LastOrDefault()}";
            string videoUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Video, videoName, null);

            var thumbnailUrl = await SaveThumbnailAsync(video.PlaylistId, video.Image);
            var cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Europe Standard Time");
            var time = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, cstZone);


            var videoDB = new Video()
            {
                Owner = user,
                Name = video.Name,
                Description = video.Description,
                Duration = new TimeSpan(0, 0, 0, video.DurationSec, 0),
                Tags = new List<Tag>(),
                DislikeCount = 0,
                LikeCount = 0,
                Views = 0,
                UploadTimestamp = time,
                DataUrl = videoUrl,
                ImageUrl = thumbnailUrl,
                MainPlaylist = _context.Playlists.Single(x => x.Id == video.PlaylistId),
            };
            if (video.Tags?.Any() ?? false)
            {
                _context.Tags.Where(x => video.Tags.Contains(x.Name)).ToList().ForEach(x => videoDB.Tags.Add(x));
            }
            _context.Videos.Add(videoDB);
            var videoPlaylist = _context.Playlists.Find(video.PlaylistId);
            if (videoPlaylist == null)
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Neplatné ID playlistu");
            }
            PlaylistsController.AddVideoToPlaylist(_context, videoPlaylist, videoDB);
            if ((video.IncludedPermissions?.UserIds?.Any() ?? false) || (video.IncludedPermissions?.GroupIds?.Any() ?? false))
            {
                PermissionsController.SavePermissions(_context, video.IncludedPermissions, videoDB, null, true);
            }
            if ((video.ExcludedPermissions?.UserIds?.Any() ?? false) || (video.ExcludedPermissions?.GroupIds?.Any() ?? false))
            {
                PermissionsController.SavePermissions(_context, video.ExcludedPermissions, videoDB, null, false);
            }
            await _context.SaveChangesAsync();

            return Ok(new PostVideoResponse() { DataUrl = videoGuid });
        }

        /// <summary>
        /// Slouží k nahrání souboru videa. Nejprve je potřeba nahrát informace k videu pomocí POST /api/videos. Data url z POST metody je nutné poslat v hlavičce x-guid.
        /// </summary>
        [HttpPost("upload")]
        [Authorize(Roles = RoleNames.Editor)]
        public async Task<ActionResult> UploadVideo(IFormFile file)
        {
            if (!Request.Headers.TryGetValue("x-guid", out var guid))
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Hlavička x-guid je prázdná");
            }
            if (_context.Videos == null)
            {
                return Problem();
            }

            var videoName = $"{guid}.{file.FileName.Split(".").LastOrDefault()}";

            try
            {
                await SaveFile.SaveFileAsync(SaveFile.FileType.Video, videoName, file, chunks: true);
            }
            catch (Exception e)
            {
                return Problem(e.Message);
            }

            return Ok();
        }

        // DELETE: api/Videos/5
        /// <summary>
        /// Smaže video
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(Guid id)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            if (video.Owner != User.GetUser(_context))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Nemáte oprávnění ke smazání videa");
            }
            SaveFile.DeleteFile(video.DataUrl);
            SaveFile.DeleteFile(video.ImageUrl);
            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [NonAction]
        private bool VideoExists(Guid id)
        {
            return (_context.Videos?.Any(e => e.Id == id)).GetValueOrDefault();
        }


        [NonAction]
        private static async Task<string> SaveThumbnailAsync(Guid channelId, IFormFile image)
        {
            string imageName = $"{channelId}[GUID].{image.FileName.Split(".")[1]}";
            return await SaveFile.SaveFileAsync(SaveFile.FileType.Thumbnail, imageName, image);
        }

        [NonAction]
        public static bool HasPermissions(Video video, User user)
        {
            if (user == null)
            {
                return video.MainPlaylist.Public;
            }
            var userGroupsIds = user.UserGroups.Select(x => x.Id).ToList();
            if (video.MainPlaylist.Public || video.Owner.Id == user.Id)
            {
                return true;
            }
            // user specific permissions
            if (video?.Permissions.Where(y => y.UserId == user.Id) is var myPermissions && (myPermissions?.Any() ?? false))
            {
                if (myPermissions.Any(x => x.OverridedEnableWatch == false))
                {
                    return false;
                }
                if (myPermissions.Any(x => x.OverridedEnableWatch == true))
                {
                    return true;
                }
            }
            // group specific permissions
            if (video?.Permissions.Where(y => y.UserGroupId != null && userGroupsIds.Contains((Guid)y.UserGroupId)) is var groupPermissions && (groupPermissions?.Any() ?? false))
            {
                if (groupPermissions.Any(x => x.OverridedEnableWatch == false))
                {
                    return false;
                }
                if (groupPermissions.Any(x => x.OverridedEnableWatch == true))
                {
                    return true;
                }
            }
            return PlaylistsController.HasPermissions(video.MainPlaylist, user);

        }

        [NonAction]
        public bool HasPermissions(Video video)
        {
            var user = User.GetUser(_context);
            return HasPermissions(video, user);
        }

        [NonAction]
        public static Video NotPermitedVideo(Video original) => new Video()
        {
            Id = original.Id,
            Owner = new User()
            {
                Id = Guid.Empty,
            },
            MainPlaylist = new Playlist()
            {
                Id = Guid.Empty
            }
        };
    }

    public static class VideoExtensions
    {
        public static IQueryable<Video> ApplyPermissions(this IQueryable<Video> query, ControllerBase controller, MyDbContext _context)
        {
            var user = controller.User.GetUser(_context);
            if (user == null)
            {
                return query.Where(x => x.MainPlaylist.Public);
            }
            var userGroupsIds = user.UserGroups.Select(x => x.Id).ToList();
            return query.Where(video =>
                video.MainPlaylist.Public ||
                video.Owner.Id == user.Id ||
                (
                    !video.Permissions.Any(y => y.UserId == user.Id && y.OverridedEnableWatch == false) &&
                    (video.Permissions.Any(y => y.UserId == user.Id && y.OverridedEnableWatch == true) ||
                    (
                        !video.Permissions.Any(y => y.UserGroupId != null && userGroupsIds.Contains((Guid)y.UserGroupId) && y.OverridedEnableWatch == false) &&
                        (video.Permissions.Any(y => y.UserGroupId != null && userGroupsIds.Contains((Guid)y.UserGroupId) && y.OverridedEnableWatch == true) ||
                            video.MainPlaylist.Permissions.Any(y => y.UserId == user.Id || (y.UserGroupId != null && userGroupsIds.Contains((Guid)y.UserGroupId)))
                        )
                    )
                    )
                )
            );
        }
    }
}
