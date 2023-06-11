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
                    .Where(x => x.IdOwner == userId)
                    .Include(x => x.Channel)
                    .Include(x => x.Owner)
                    .Include(x => x.Videos)
                    .Select(x => x.ToDTO())
                    .ToListAsync();
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
                    .Include(x => x.Channel)
                    .Include(x => x.Owner)
                    .Include(x => x.Videos)
                    .ThenInclude(y => y.Channel)
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
            if (playlistDB == null || playlistDB.IdOwner != userId)
            {
                return NotFound();
            }

            playlistDB.Description = playlist.Description;
            
            if (playlist?.ChannelId.HasValue ?? false)
            {
                playlistDB.Channel = await _context.Channels.FindAsync(playlist.ChannelId);
            }
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
            if (playlistDB == null || playlistDB.IdOwner != userId)
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
                IdOwner = userId ?? Guid.Empty,
                CreatedTimestamp = DateTime.UtcNow,
                Description = playlist.Description,
                Videos = playlist.Videos,
                Name = playlist.Name
            };
            if (playlist?.ChannelId.HasValue ?? false)
            {
                playlistDB.Channel = await _context.Channels.FindAsync(playlist.ChannelId);
            }
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
            if (playlistDB == null || playlistDB.IdOwner != userId)
            {
                return NotFound();
            }

            _context.Playlists.Remove(playlistDB);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
