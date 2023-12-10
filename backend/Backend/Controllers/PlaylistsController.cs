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

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public PlaylistsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Playlists/my
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
                return Unauthorized();
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

        // GET: api/Playlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlaylistDTO>>> GetPlaylists([FromQuery] string? orderBy = null, int? limit = null, int? offset = null)
        {
            if (_context.Playlists == null)
            {
                return NotFound();
            }
            IQueryable<Playlist> query = _context.Playlists;

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
            return await query.Include(x => x.Owner).Select(x => x.ToDTO()).ToListAsync();
        }

        // GET: api/Playlists/5
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
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

            if (playlist == null)
            {
                return NotFound();
            }

            return playlist.ToDTO();
        }

        // PUT: api/Playlists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlaylist(Guid id, [FromForm] PlaylistPostPutDTO playlist)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var playlistDB = await _context.Playlists.FindAsync(id);
            if (playlistDB == null || playlistDB.Owner.Id != userId)
            {
                return NotFound();
            }

            playlistDB.Description = playlist.Description;
            
            if (playlist?.Thumbnail != null)
            {
                var posterName = $"{playlist.Thumbnail.Name}[GUID].{playlist.Thumbnail.FileName.Split(".")[1]}";
                playlistDB.ThumbnailUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, posterName, playlist.Thumbnail);
            }
            playlistDB.Videos = playlist.Videos;
            playlistDB.Name = playlist.Name;
            _context.Entry(playlistDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Playlists/5
        [HttpPut("{id}/video/{videoId}")]
        public async Task<IActionResult> PutVideoInPlaylist(Guid id, Guid videoId, [FromQuery] bool add)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var playlistDB = await _context.Playlists.Where(x => x.Id == id).Include(x => x.Videos).FirstOrDefaultAsync();
            if (playlistDB == null || playlistDB.Owner.Id != userId)
            {
                return NotFound();
            }
            var videoDB = await _context.Videos.FindAsync(videoId);
            if (videoDB == null)
            {
                return NotFound();
            }
            playlistDB.Videos ??= new List<Video>();
            if (add)
            {
                playlistDB.Videos.Add(videoDB);
            }
            else
            {
                playlistDB.Videos.Remove(videoDB);
            }
            _context.Entry(playlistDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Playlists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostPlaylist([FromForm] PlaylistPostPutDTO playlist)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var playlistDB = new Playlist
            {
                Owner = User.GetUser(_context),
                CreatedTimestamp = DateTime.UtcNow,
                Description = playlist.Description,
                Videos = playlist.Videos,
                Name = playlist.Name
            };
            if (playlist?.Thumbnail != null)
            {
                var posterName = $"{playlist.Thumbnail.Name}[GUID].{playlist.Thumbnail.FileName.Split(".")[1]}";
                playlistDB.ThumbnailUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, posterName, playlist.Thumbnail);
            }

            _context.Playlists.Add(playlistDB);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Playlists/5
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
                return Unauthorized();
            }
            var playlistDB = await _context.Playlists.FindAsync(id);
            if (playlistDB == null || playlistDB.Owner.Id != userId)
            {
                return NotFound();
            }

            _context.Playlists.Remove(playlistDB);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public static void AddVideoToPlaylist(MyDbContext _context, Guid playlistId, Video video)
        {
            var playlist = _context.Playlists.Single(x => x.Id == playlistId);
            playlist.Videos ??= new List<Video>();
            playlist.Videos.Add(video);
            _context.SaveChanges();
        }
        public static void RemoveVideoFromPlaylist(MyDbContext _context, Guid playlistId, Video video)
        {
            var playlist = _context.Playlists.Single(x => x.Id == playlistId);
            playlist.Videos ??= new List<Video>();
            playlist.Videos.Remove(video);
            _context.SaveChanges();
        }
    }
}
