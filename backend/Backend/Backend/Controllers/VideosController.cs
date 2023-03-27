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
        public async Task<ActionResult<IEnumerable<Video>>> GetVideos()
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            return await _context.Videos.ToListAsync();
        }

        // GET: api/Videos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Video>> GetVideo(Guid id)
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

            return video;
        }

        // PUT: api/Videos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideo(Guid id, Video video)
        {
            if (id != video.Id)
            {
                return BadRequest();
            }

            _context.Entry(video).State = EntityState.Modified;

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
        public class UploadVideoDTO
        {
            public IFormFile File { get; set; }
            public string Name { get; set; }
            public string? Description { get; set; }
            public int DurationSec { get; set; }
            public IFormFile Image { get; set; }
            // přidat na formulář
            public Guid ChannelId { get; set; }
            public Tag[]? Tags { get; set; }

        }

        // POST: api/Videos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Video>> PostVideo([FromForm] UploadVideoDTO video)
        {
            if (_context.Videos == null)
            {
                return Problem("Entity set 'MyDbContext.Videos'  is null.");
            }

            // upload video
            var videoName = $"{video.ChannelId}[GUID].{video.File.FileName.Split(".")[1]}";
            string videoUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Video, videoName, video.File);


            // upload image
            string imageName = $"{video.ChannelId}[GUID].{video.Image.FileName.Split(".")[1]}";
            string imageUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Thumbnail, imageName, video.Image);



            var videoDB = new Video()
            {
                Name = video.Name,
                Description = video.Description,
                ChannelId = video.ChannelId,
                Duration = new TimeSpan(0,0,0, video.DurationSec, 0),
                Tags = video.Tags,
                DislikeCount = 0,
                LikeCount = 0,
                Views = 0,
                UploadTimestamp = DateTime.UtcNow,
                DataUrl = videoUrl,
                ImageUrl = imageUrl,
            };
            _context.Videos.Add(videoDB);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVideo", new { id = videoDB }, video);
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

            _context.Videos.Remove(video);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool VideoExists(Guid id)
        {
            return (_context.Videos?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
