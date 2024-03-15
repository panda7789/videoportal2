﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Identity;

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
        public async Task<ActionResult<UserVideoStatsDTO>> GetUserVideoStats(Guid videoId)
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
            return Get(videoId, userId, _context).ToDTO();
        }

        [HttpGet("{videoId}/stats")]
        public async Task<ActionResult<LikeDislikeStats>> GetLikeDislikeStats(Guid videoId)
        {
            if (_context.UserVideoStats == null)
            {
                return NotFound();
            }
            var query = _context.UserVideoStats.Where(x => x.VideoId == videoId);
            return new LikeDislikeStats(
                query.Count(x => x.Like),
                query.Count(x => x.Dislike)
                );

        }

        // PUT: api/UserVideoStats/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{videoId}")]
        public async Task<IActionResult> PutUserVideoStats(Guid videoId, UserVideoStatsDTO userVideoStats)
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
            if (userVideoStats.Like && userVideoStats.Dislike)
            {
                return BadRequest();
            }
            var result = _context.UserVideoStats.Where(x => x.UserId == userId && x.VideoId == videoId).FirstOrDefault();
            if (result == null)
            {
                _context.Entry(userVideoStats).State = EntityState.Added;
            }
            else
            {
                result.Dislike = userVideoStats.Dislike;
                result.Like = userVideoStats.Like;
                result.AddedToPlaylist = userVideoStats.AddedToPlaylist;
                result.TimeWatchedSec = userVideoStats.TimeWatchedSec;
                _context.Entry(result).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{videoId}/watched")]
        public async Task<IActionResult> PutVideoWatchedtime(Guid videoId, [FromBody] int watchedSec)
        {
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var result = _context.UserVideoStats.Where(x => x.UserId == userId && x.VideoId == videoId).FirstOrDefault();
            if (result == null)
            {
                result = CreateEmpty((Guid)userId, videoId);
                _context.UserVideoStats.Add(result);
            }
            result.TimeWatchedSec = watchedSec;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static UserVideoStats CreateEmpty(Guid userId, Guid videoId) => new UserVideoStats()
        {
            VideoId = videoId,
            UserId = userId,
            AddedToPlaylist = false,
            Dislike = false,
            Like = false,
            TimeWatchedSec = 0
        };

        public static UserVideoStats Get(Guid videoId, Guid? userId, MyDbContext _context)
        {
            var result = _context.UserVideoStats.Where(x => x.VideoId == videoId && x.UserId == userId).FirstOrDefault();
            if (result == null)
            {
                var created = CreateEmpty((Guid)userId, videoId);
                _context.UserVideoStats.Add(created);
                return created;
            }
            return result;
        }
    }
}
