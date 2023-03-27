using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ChannelsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Channels/my
        [HttpGet("my-channels")]
        public async Task<ActionResult<IEnumerable<ChannelDTO>>> GetMyChannels()
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            return await _context.Channels.Where(x => x.IdOwner == userId).ToListAsync();
        }

        // GET: api/Channels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChannelDTO>> GetChannelDTO(Guid id)
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            var channelDTO = await _context.Channels.FindAsync(id);

            if (channelDTO == null)
            {
                return NotFound();
            }

            return channelDTO;
        }

        // PUT: api/Channels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChannelDTO(Guid id, ChannelDTO channelDTO)
        {
            if (id != channelDTO.Id)
            {
                return BadRequest();
            }

            _context.Entry(channelDTO).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChannelDTOExists(id))
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

        // POST: api/Channels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ChannelDTO>> PostChannelDTO([FromForm] ChannelPostRequest channelDTO)
        {
            if (_context.Channels == null)
            {
                return Problem("Entity set 'MyDbContext.ChannelDTO'  is null.");
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var channel = new Channel()
            {
                Name = channelDTO.Name,
                PinnedVideoId = channelDTO.PinnedVideoId,
                SubscribersCount = 0,
                IdOwner = userId ?? Guid.Empty,
            };

            if (channelDTO.Poster != null)
            {
                var posterName = $"{channelDTO.Name}[GUID].{channelDTO.Poster.FileName.Split(".")[1]}";
                channel.PosterUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, posterName, channelDTO.Poster);
            }
            if (channelDTO.Avatar != null)
            {
                var avatarName = $"{channelDTO.Name}[GUID].{channelDTO.Avatar.FileName.Split(".")[1]}";
                channel.AvatarUrl = await SaveFile.SaveFileAsync(SaveFile.FileType.Image, avatarName, channelDTO.Avatar);
            }


            _context.Channels.Add(channel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChannelDTO", new { id = channel.Id }, channelDTO);
        }

        // DELETE: api/Channels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChannelDTO(Guid id)
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            var channelDTO = await _context.Channels.FindAsync(id);
            if (channelDTO == null)
            {
                return NotFound();
            }

            _context.Channels.Remove(channelDTO);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChannelDTOExists(Guid id)
        {
            return (_context.Channels?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
