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
using System.Reflection.PortableExecutable;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using NuGet.Packaging;

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
            return await _context.Channels.Where(x => x.IdOwner == userId).Select(x => x.ToDTO()).ToListAsync();
        }

        // GET: api/Channels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChannelDTO>>> GetChannels()
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            return await _context.Channels.OrderBy(x => x.Name).Select(x => x.ToDTO()).ToListAsync();
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

            return channelDTO.ToDTO();
        }

        [HttpGet("{id}/channel-videos")]
        public async Task<ActionResult<WithTotalCount<VideoDTO>>> GetChannelLatestVideos(Guid id, [FromQuery] int? limit = null, int? offset = null)
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            IQueryable<Video> query = _context.Videos
                .Include(x => x.Channel)
                .Where(x => x.ChannelId == id)
                .OrderByDescending(x => x.UploadTimestamp);

            var totalCount = query.Count();


            if (offset.HasValue)
            {
                query = query.Skip(offset.Value);
            }
            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }
            else
            {
                query = query.Take(10);
            }

            var latestVideos = await query.Select(x => x.ToDTO())
                .ToListAsync();
            if (latestVideos == null)
            {
                return NotFound();
            }
            return new WithTotalCount<VideoDTO>() {
                Items = latestVideos,
                TotalCount = totalCount
            };
        }

        [HttpGet("{id}/channel-playlists")]
        public async Task<ActionResult<WithTotalCount<PlaylistDTO>>> GetChannelPlaylists(Guid id, [FromQuery] int? limit = null, int? offset = null)
        {
            if (_context.Channels == null)
            {
                return NotFound();
            }
            IQueryable<Playlist> query = _context.Playlists
                .Include(x => x.Channel)
                .Include(x => x.Owner)
                .Include(x => x.Videos)
                .Where(x => x.ChannelId == id)
                .OrderByDescending(x => x.CreatedTimestamp);

            var totalCount = query.Count();


            if (offset.HasValue)
            {
                query = query.Skip(offset.Value);
            }
            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }
            else
            {
                query = query.Take(10);
            }

            var latestVideos = await query.Select(x => x.ToDTO()).ToListAsync();
            if (latestVideos == null)
            {
                return NotFound();
            }
            return new WithTotalCount<PlaylistDTO>()
            {
                Items = latestVideos,
                TotalCount = totalCount
            };
        }

        [HttpGet("{id}/channel-advanced-info")]
        public ActionResult<ChannelAdvancedInfoDTO> GetChannelAdvancedInfo(Guid id)
        {
            if (_context.ChannelAdvancedInfos == null)
            {
                return NotFound();
            }
            var channelAdvancedInfo = _context.ChannelAdvancedInfos.Where(x => x.ChannelId == id).Include(x => x.RelatedChannels).FirstOrDefault();
            if (channelAdvancedInfo == null)
            {
                return NotFound();
            }
            return channelAdvancedInfo.ToDTO();
        }

        [HttpGet("{id}/channel-user-info")]
        public ActionResult<ChannelUserSpecificInfoDTO> GetChannelUserSpecificInfo(Guid id)
        {
            if (_context.ChannelUserSpecificInfos == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var result = _context.ChannelUserSpecificInfos.Where(x => x.ChannelId == id && x.UserId == userId).FirstOrDefault();
            if (result == null)
            {
                var newInfo = new ChannelUserSpecificInfoDTO()
                {
                    Subscribed = false
                };
                return newInfo;
            }
            return result.ToDTO();
        }

        [HttpPut("{id}/channel-user-info")]
        public async Task<IActionResult> PutChannelUserInfo(Guid id, ChannelUserSpecificInfoDTO channelUser)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = _context.ChannelUserSpecificInfos.Where(x => x.ChannelId == id && x.UserId == userId).FirstOrDefault();

            if (result == null)
            {
                if (!channelUser.Subscribed)
                {
                    return Ok();
                }
                result = new ChannelUserSpecificInfo()
                {
                    ChannelId = id,
                    UserId = (Guid)userId,
                    Subscribed = channelUser.Subscribed
                };
                _context.ChannelUserSpecificInfos.Add(result);
            }
            else
            {
                if (!channelUser.Subscribed)
                {
                    _context.ChannelUserSpecificInfos.Remove(result);
                }
                else
                {
                    _context.Entry(result).State = EntityState.Modified;
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            var channel = _context.Channels.Where(x => x.Id == id).FirstOrDefault();
            if (channel != null)
            {
                var count = channel.SubscribersCount;
                channel.SubscribersCount = _context.ChannelUserSpecificInfos.Where(x => x.ChannelId == id).Count();
                await _context.SaveChangesAsync();
            }
            



            return NoContent();
        }



        // PUT: api/Channels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChannelDTO(Guid id, [FromForm] ChannelPostPutRequest channelDTO)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var channel = await _context.Channels.FindAsync(id);
            if (channel == null)
            {
                return NotFound();
            }
            var channelAdvancedInfo = _context.ChannelAdvancedInfos.Where(x => x.ChannelId == id).FirstOrDefault();
            if (channelAdvancedInfo == null)
            {
                return NotFound();
            }
            if (channel.IdOwner != userId)
            {
                return Unauthorized();
            }

            channel.Name = channelDTO.Name;
            channel.PinnedVideoId = channelDTO.PinnedVideoId;
            channelAdvancedInfo.Description = channelDTO.Description;
            if (channelDTO?.RelatedChannels?.Any() ?? false)
            {
                var related = _context.Channels.Where(x => channelDTO.RelatedChannels.Contains(x.Id));
                if (related.Any())
                {
                    channelAdvancedInfo.RelatedChannels = related.ToList();
                }
            }
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


            _context.Entry(channel).State = EntityState.Modified;
            _context.Entry(channelAdvancedInfo).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Channels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ChannelDTO>> PostChannelDTO([FromForm] ChannelPostPutRequest channelDTO)
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
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

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

            var channelAdvancedInfo = new ChannelAdvancedInfo()
            {
                ChannelId = channel.Id,
                DateOfRegistration = DateTime.UtcNow,
                Description = channelDTO.Description,
                Email = userEmail                
            };
            if (channelDTO?.RelatedChannels?.Any() ?? false)
            {
                var related = _context.Channels.Where(x => channelDTO.RelatedChannels.Contains(x.Id));
                if (related.Any())
                {
                    channelAdvancedInfo.RelatedChannels.AddRange(related);
                }
            }
            _context.ChannelAdvancedInfos.Add(channelAdvancedInfo);
            await _context.SaveChangesAsync();

            return Ok();
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
