using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using System.Threading.Channels;
using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Backend.Migrations;
using System.ComponentModel;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        public readonly MyDbContext _context;
        public const string WatchLaterPlaylistName = "Přehrát později";

        public PlaylistsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Playlists
        /// <summary>
        /// Vrací playlisty, které uživatel může vidět.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlaylistBasicInfoDTO>>> GetPlaylists([FromQuery] string? orderBy = null, int? limit = null, int? offset = null)
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            IQueryable<Playlist> query = _context.Playlists.ApplyPermissions(this);

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
                query = query.OrderByDescending(x => x.Id);
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
            return await query.Include(x => x.Videos).ThenInclude(x => x.Video).Include(x => x.Owner).Select(x => x.ToBasicDTO()).ToListAsync();
        }

        // GET: api/Playlists/5
        /// <summary>
        /// Vrací playlist
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PlaylistDTO>> GetPlaylist(Guid id)
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            var playlist = await
                _context.Playlists
                    .Where(x => x.Id == id)
                    .Include(x => x.Videos)
                    .ThenInclude(x => x.Video)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

            if (playlist == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Playlist nenalezen");
            }
            if (!HasPermissions(playlist))
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Přístup odepřen");
            }
            var user = User.GetUser(_context);
            playlist.Videos = playlist.Videos.OrderBy(x => x.Order).Select((x,i) => !VideosController.HasPermissions(x.Video, user) ? new PlaylistVideo() { Video = VideosController.NotPermitedVideo(x.Video), Order = i } : x).ToList();

            return playlist.ToDTO();
        }

        // PUT: api/Playlists/5
        /// <summary>
        /// Upravuje existující playlist
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlaylist(Guid id, [FromForm] PlaylistPostPutDTO playlist)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            if (playlist == null)
            {
                return BadRequest();
            }
            var playlistDB = await _context.Playlists.Include(x => x.Videos).Where(x => x.Id ==id).FirstOrDefaultAsync();
            if (playlistDB == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Playlist nenalezen");
            }
            if (playlistDB.Owner.Id != userId)
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Nemáte oprávnění k úpravě playlistu");
            }
            ValidateDuplicates(playlist.Name, id);

            playlistDB.Description = playlist.Description;
            if (playlist.Thumbnail != null)
            {
                var posterName = $"{playlist.Thumbnail.Name}[GUID].{playlist.Thumbnail.FileName.Split(".")[1]}";
                playlistDB.ThumbnailUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, posterName, playlist.Thumbnail);
            }
            var originalPublic = playlist.IsPublic;
            foreach (var video in playlistDB.Videos)
            {
                _context.Remove(video);
            }
            playlistDB.Videos.Clear();

            if (playlist.Videos?.Count > 0)
            {
                var arr = playlist.Videos.ToArray();
                for (var i = 0; i < playlist.Videos.Count; i++)
                {
                    var video = await _context.Videos.FindAsync(arr[i]);
                    if (video == null)
                    {
                        return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
                    }
                    var added = new PlaylistVideo() { Video = video, Order = i, VideoId = video.Id, Playlist = playlistDB, PlaylistId = playlistDB.Id };
                    playlistDB.Videos.Add(added);
                }
            }
            else
            {
                playlistDB.Videos = new List<PlaylistVideo>();
            }
            playlistDB.Name = playlist.Name;
            playlistDB.Public = playlist.IsPublic;
            if (!playlist.IsPublic || !originalPublic)
            {
                PermissionsController.ClearExistingPermissions(_context, playlist: playlistDB);
                if (!playlist.IsPublic && ((playlist.Permissions?.UserIds?.Any() ?? false) || (playlist.Permissions?.GroupIds?.Any() ?? false)))
                {
                    PermissionsController.SavePermissions(_context, playlist: playlistDB, permissions: playlist.Permissions);
                }
            }
            _context.Playlists.Update(playlistDB);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Playlists
        /// <summary>
        /// Vytváří nový playlist
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> PostPlaylist([FromForm] PlaylistPostPutDTO playlist)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            if (playlist == null)
            {
                return BadRequest();
            }
            ValidateDuplicates(playlist.Name, null);
            var videos = playlist.Videos?.Count > 1 ? _context.Videos.Where(x => playlist.Videos.Contains(x.Id)).ToList() : new List<Video>();
            var playlistDB = new Playlist
            {
                Owner = User.GetUser(_context),
                CreatedTimestamp = DateTime.UtcNow,
                Description = playlist.Description,
                Name = playlist.Name,
                Public = playlist.IsPublic
            };
            playlistDB.Videos = videos.Select((x, i) => new PlaylistVideo() { Video = x, Order = i, Playlist = playlistDB }).ToList();
            if (playlist.Thumbnail != null)
            {
                var posterName = $"{playlist.Thumbnail.Name}[GUID].{playlist.Thumbnail.FileName.Split(".")[1]}";
                playlistDB.ThumbnailUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, posterName, playlist.Thumbnail);
            }

            _context.Playlists.Add(playlistDB);
            if (!playlist.IsPublic && (playlist.Permissions?.UserIds?.Any() ?? false) || (playlist.Permissions?.GroupIds?.Any() ?? false))
            {
                PermissionsController.SavePermissions(_context, playlist: playlistDB, permissions: playlist.Permissions);
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Playlists/5
        /// <summary>
        /// Maže playlist
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(Guid id)
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            var playlistDB = _context.Playlists.Include(x => x.Videos).Where(x => x.Id == id).FirstOrDefault();
            if (playlistDB == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            if (playlistDB.Owner.Id != userId)
            {
                return Problem(statusCode: StatusCodes.Status403Forbidden, detail: "Nemáte oprávnění k smazání playlistu");
            }
            if (playlistDB.Videos.Count > 0)
            {
                return Problem("Před odstraněním playlistu je nutné odebrat všechna videa v něm.");
            }

            _context.Playlists.Remove(playlistDB);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Vrací seznam pokročilých oprávnění pro playlist
        /// </summary>
        [HttpGet("{id}/playlist-permissions")]
        public async Task<ActionResult<ObjectPermissions>> GetPlaylistPermissions(Guid id)
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Playlist nenalezen");
            }
            var permissions = await _context.Permissions.Where(x => x.PlaylistId == id).ToListAsync();
            var userPermissions = permissions.Where(x => x.UserId != null).Select(x => x.UserId ?? Guid.Empty).ToList();
            var groupPermissions = permissions.Where(x => x.UserGroupId != null).Select(x => x.UserGroupId ?? Guid.Empty).ToList();
            return new ObjectPermissions(
                UserIds: userPermissions,
                GroupIds: groupPermissions
                );
        }

        /// GET: api/Playlists/my
        /// <summary>
        /// Vrací seznam playlistů, které vlastní přihlášený uživatel.
        /// </summary>
        [HttpGet("my-playlists")]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetMyPlaylists()
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            return await
                _context.Playlists
                    .Include(x => x.Owner)
                    .Where(x => x.Owner.Id == userId)
                    .Include(x => x.Videos)
                                           .AsNoTracking()
                    .Select(x => x.ToDTO())
                    .ToListAsync();
        }


        /// <summary>
        /// Vrací ID playlistu 'Přehrát později' pro přihlášeného uživatele.
        /// </summary>
        [HttpGet("watch-later-id")]
        public async Task<ActionResult<Guid>> GetWatchLaterId()
        {

            var user = User.GetUser(_context);
            if (user == null)
            {
                return Problem(statusCode: StatusCodes.Status401Unauthorized, detail: $"Nepřihlášen");
            }
            var userWatchLaterPlaylist = GetOrCreateWatchLater();
            return userWatchLaterPlaylist.Id;
        }

        /// <summary>
        /// Přidá nebo odebere video z playlistu 'Přehrát později'. V případě zdařilé operace vrací v odpovědi příznak, zdali se video do playlistu přidávalo(true), nebo odebíralo(false).
        /// </summary>
        [HttpPost("add-remove-watch-later")]
        public async Task<ActionResult<bool>> AddOrRemoveVideoFromWatchLater(Guid id)
        {
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Video nenalezeno");
            }
            var userWatchLaterPlaylist = GetOrCreateWatchLater();
            if (userWatchLaterPlaylist.Videos == null)
            {
                userWatchLaterPlaylist.Videos = new List<PlaylistVideo>();
            }

            var userId = User.GetUserId();
            var userVideoStats = UserVideoStatsController.Get(video.Id, userId, _context);

            var added = false;
            if (userWatchLaterPlaylist.Videos.Any(x => x.Video.Id == video.Id))
            {
                var arr = userWatchLaterPlaylist.Videos.ToList();
                var index = arr.FindIndex(x => x.Video.Id == video.Id);
                for (var i = index; i < arr.Count; i++)
                {
                    arr[i].Order--;
                }
                arr.RemoveAt(index);
                userWatchLaterPlaylist.Videos = arr;
                if (userVideoStats != null)
                {
                    userVideoStats.AddedToPlaylist = false;
                }
                added = false;
            }
            else
            {
                userWatchLaterPlaylist.Videos.Add(new PlaylistVideo() { Video = video, Order = userWatchLaterPlaylist.Videos.LastOrDefault()?.Order + 1 ?? 0 });
                if (userVideoStats != null)
                {
                    userVideoStats.AddedToPlaylist = true;
                }
                added = true;
            }
            await _context.SaveChangesAsync();
            return new ActionResult<bool>(added);

        }

        /// <summary>
        /// Přidá video do playlistu
        /// </summary>
        public static void AddVideoToPlaylist(MyDbContext _context, Playlist playlist, Video video)
        {
            playlist.Videos ??= new List<PlaylistVideo>();
            playlist.Videos.Add(new PlaylistVideo() { Video = video, Order = playlist.Videos.LastOrDefault()?.Order + 1 ?? 0, Playlist = playlist });
            _context.SaveChanges();
        }
        /// <summary>
        /// Odebere video z playlistu
        /// </summary>
        public static void RemoveVideoFromPlaylist(MyDbContext _context, Playlist playlist, Video video)
        {
            playlist.Videos ??= new List<PlaylistVideo>();
            var arr = playlist.Videos.ToList();
            var index = arr.FindIndex(x => x.VideoId == video.Id);
            if (index == -1)
            {
                return;
            }
            for (var i = index; i < arr.Count; i++)
            {
                arr[i].Order--;
            }
            arr.RemoveAt(index);
            playlist.Videos = arr;
            _context.SaveChanges();
        }
        public static bool HasPermissions(Playlist playlist, User user)
        {
            if (user == null)
            {
                return playlist.Public;
            }
            var userGroupsIds = user.UserGroups.Select(x => x.Id).ToList();
            if (playlist.Public || playlist.Owner.Id == user.Id)
            {
                return true;
            }
            return playlist.Permissions.Any(x => (x.UserId == user.Id || (x.UserGroupId != null && userGroupsIds.Contains((Guid)x.UserGroupId))));
        }

        private bool HasPermissions(Playlist playlist)
        {
            var user = User.GetUser(_context);
            return HasPermissions(playlist, user);
        }

        public static Playlist CreateWatchLaterPlaylist(User user)
        {
            var playlist = new Playlist
            {
                Name = WatchLaterPlaylistName,
                Owner = user,
                Public = false,
                CreatedTimestamp = DateTime.UtcNow,
                Videos = new List<PlaylistVideo>()
            };
            user.WatchLaterPlaylist = playlist;
            return playlist;
        }

        private void ValidateDuplicates(string name, Guid? id)
        {
            if (name == WatchLaterPlaylistName)
            {
                return;
            }
            if (_context.Playlists.Any(x => x.Name == name && x.Id != id))
            {
                throw new Exception("Playlist se stejným názvem již existuje");
            }
        }

        private Playlist GetOrCreateWatchLater()
        {
            var user = User.GetUser(_context);
            if (user == null)
            {
                throw new Exception();// Unauthorized();
            }
            var userWatchLaterPlaylist = _context.Playlists.Where(x => x.Id == user.WatchLaterPlaylistId).Include(x => x.Videos).FirstOrDefault();
            if (userWatchLaterPlaylist == null)
            {
                userWatchLaterPlaylist = CreateWatchLaterPlaylist(user);
            }
            if (userWatchLaterPlaylist == null)
            {
                throw new Exception("Uživatel nemá playlist přehrát později a nepovedlo se jej vytvořit.");
            }
            return userWatchLaterPlaylist;
        }
    }
    public static class PlaylistExtensions
    {
        public static IQueryable<Playlist> ApplyPermissions(this IQueryable<Playlist> query, PlaylistsController controller)
        {
            var user = controller.User.GetUser(controller._context);
            if (user == null)
            {
                return query.Where(x => x.Public);
            }
            var userGroupsIds = user.UserGroups.Select(x => x.Id).ToList();
            return query.Where(x => x.Public
                                     || x.Owner.Id == user.Id
                                     || x.Permissions.Any(y => y.UserId == user.Id || (y.UserGroupId != null && userGroupsIds.Contains((Guid)y.UserGroupId))));
        }
    }
}
