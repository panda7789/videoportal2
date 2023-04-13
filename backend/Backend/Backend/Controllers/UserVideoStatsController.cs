using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserVideoStatsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public UserVideoStatsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/UserVideoStats/5
        [HttpGet("{videoId}")]
        public async Task<ActionResult<UserVideoStats>> GetUserVideoStats(Guid videoId)
        {
            if (_context.UserVideoStats == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            var result = _context.UserVideoStats.Where(x => x.VideoId == videoId && x.UserId == userId).FirstOrDefault();
            if (result == null)
            {
                var newItem = CreateEmpty((Guid)userId, videoId);
                return newItem;
            }
            return result;
        }

        // PUT: api/UserVideoStats/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{videoId}")]
        public async Task<IActionResult> PutUserVideoStats(Guid videoId, UserVideoStats userVideoStats)
        {
            if (videoId != userVideoStats.VideoId)
            {
                return BadRequest();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }
            if (userVideoStats.UserId != userId)
            {
                return BadRequest();
            }
            
            var result = _context.UserVideoStats.Where(x => x.UserId == userId && x.VideoId == videoId).FirstOrDefault();
            if (result == null)
            {
                _context.Entry(userVideoStats).State = EntityState.Added;
            }
            _context.Entry(userVideoStats).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private UserVideoStats CreateEmpty(Guid userId, Guid videoId) => new UserVideoStats()
        {
            VideoId = videoId,
            UserId = userId,
            AddedToPlaylist = false,
            Dislike = false,
            Like = false,
            TimeWatchedSec = 0
        };
    }
}
