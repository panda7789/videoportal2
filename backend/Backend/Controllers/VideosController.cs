using System;
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

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly MyDbContext _context;

        public VideosController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Videos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> GetVideos([FromQuery] string? orderBy = null, int? limit = null, int? offset = null)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            IQueryable<Video> query = _context.Videos.Include(x => x.MainPlaylist);

            if (!string.IsNullOrEmpty(orderBy))
            {
                string[] orderByParts = orderBy?.Split(':') ?? Array.Empty<string>();
                if (orderByParts.Length == 0 ) {
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
                }
            }
            else
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
            return await query.Select(x => x.ToDTO()).ToListAsync();
        }


        // GET: api/Videos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDTO>> GetVideo(Guid id)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var video = await _context.Videos
                    .Include(x => x.Tags)
                    .Include(x => x.MainPlaylist)
                       .AsNoTracking() 
                    .FirstOrDefaultAsync(x => x.Id == id);
            if (video == null)
            {
                return NotFound();
            }
            var userStats = await _context.UserVideoStats.Where(x => x.VideoId == id).ToListAsync();
            video.LikeCount = userStats.Where(x => x.Like).Count();
            video.DislikeCount = userStats.Where(x => x.Dislike).Count();
            return video.ToDTO();
        }

        [HttpGet("{id}/video-playlists")]
        public async Task<ActionResult<IEnumerable<Guid>>> GetVideoPlaylists(Guid id)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            var video = await _context.Videos.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }
            var playlists = await _context.Playlists.Where(x => x.Videos.Contains(video)).Select(x => x.Id).ToListAsync();
            return playlists;
        }

        // GET: api/videos/my
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
                return Unauthorized();
            }
            return await _context.Videos.Select(x => x.ToDTO()).ToListAsync();
        }

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
                return NotFound();
            }

            var shortedVideoDescription = video?.Description == null ? null : String.Join(' ', video.Description.Split().Take(5));
            var relatedVideos = _context.Videos.FromSql($@"SELECT
                      (MATCH(name) AGAINST('{video.Name}') +
                       MATCH(description) AGAINST('{shortedVideoDescription}')) as Relevance,
                      v.*
                    FROM Videos as v
                    WHERE v.id <> {video.Id}
                    ORDER BY Relevance desc
                    LIMIT 10")
                .AsNoTracking()
                .Select(x => x.ToDTO())
                .ToListAsync();
            return await relatedVideos;
        }

        public class ModifyVideoDTO
        {
            public string Name { get; set; }
            public string? Description { get; set; }
            public IFormFile? Image { get; set; }
            public Guid PlaylistId { get; set; }
            public ICollection<string>? Tags { get; set; }

        }
        // PUT: api/Videos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideo(Guid id, [FromForm] ModifyVideoDTO modifiedVideo)
        {
            var video = await _context.Videos.Include(x => x.Tags).FirstOrDefaultAsync(x => x.Id == id);
            if (video == null)
            {
                return NotFound();
            }
            _context.Entry(video).State = EntityState.Modified;
            video.Name = modifiedVideo.Name;
            video.Description = modifiedVideo.Description;
            if (video.MainPlaylist != null && video.MainPlaylist.Id != modifiedVideo.PlaylistId)
            {
                PlaylistsController.RemoveVideoFromPlaylist(_context, video.MainPlaylist.Id, video);
                video.MainPlaylist = _context.Playlists.Single(x => x.Id == modifiedVideo.PlaylistId);
                PlaylistsController.AddVideoToPlaylist(_context, modifiedVideo.PlaylistId, video);
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
        public class PostVideoRequest
        {
            //public IFormFile File { get; set; }
            public string FileName { get; set; }
            public string Name { get; set; }
            public string? Description { get; set; }
            public int DurationSec { get; set; }
            public IFormFile Image { get; set; }
            public Guid PlaylistId { get; set; }
            public ICollection<string>? Tags { get; set; }

        }

        public class PostVideoResponse
        {
            public string DataUrl { get; set; }

        }

        // POST: api/Videos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = RoleNames.Editor)]

        public async Task<ActionResult<PostVideoResponse>> PostVideo([FromForm] PostVideoRequest video)
        {
            if (_context.Videos == null)
            {
                return Problem("Entity set 'MyDbContext.Videos'  is null.");
            }

            // upload video
            var videoGuid = $"{video.PlaylistId}{Guid.NewGuid()}";
            var videoName = $"{videoGuid}.{video.FileName.Split(".").LastOrDefault()}";
            string videoUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Video, videoName, null);


            var thumbnailUrl = await SaveThumbnailAsync(video.PlaylistId, video.Image);

            var videoDB = new Video()
            {
                Owner = User.GetUser(_context),
                Name = video.Name,
                Description = video.Description,
                Duration = new TimeSpan(0,0,0, video.DurationSec, 0),
                Tags = new List<Tag>(),
                DislikeCount = 0,
                LikeCount = 0,
                Views = 0,
                UploadTimestamp = DateTime.UtcNow,
                DataUrl = videoUrl,
                ImageUrl = thumbnailUrl,
                MainPlaylist = _context.Playlists.Single(x => x.Id == video.PlaylistId)
            };
            if (video.Tags?.Any() ?? false)
            {
                _context.Tags.Where(x => video.Tags.Contains(x.Name)).ToList().ForEach(x => videoDB.Tags.Add(x));
            }
            _context.Videos.Add(videoDB);
            PlaylistsController.AddVideoToPlaylist(_context, video.PlaylistId, videoDB);
            await _context.SaveChangesAsync();

            return Ok(new PostVideoResponse() { DataUrl= videoGuid });
        }
        [HttpPost("upload")]
        [Authorize(Roles = RoleNames.Editor)]

        public async Task<ActionResult> UploadVideo(IFormFile file)
        {
            if (!Request.Headers.TryGetValue("x-guid", out var guid))
            {
                return Problem("Header x-guid is empty");
            }
            if (_context.Videos == null)
            {
                return Problem("Entity set 'MyDbContext.Videos'  is null.");
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
                return NotFound();
            }
            SaveFile.DeleteFile(video.DataUrl);
            SaveFile.DeleteFile(video.ImageUrl);
            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool VideoExists(Guid id)
        {
            return (_context.Videos?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private static async Task<string> SaveThumbnailAsync(Guid channelId, IFormFile image)
        {
            string imageName = $"{channelId}[GUID].{image.FileName.Split(".")[1]}";
            return await SaveFile.SaveFileAsync(SaveFile.FileType.Thumbnail, imageName, image);
        }
    }
}
