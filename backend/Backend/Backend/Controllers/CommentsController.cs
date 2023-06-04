using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Data;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly UserManager<User> _userManager;

        public CommentsController(MyDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Comments
        [HttpGet("{videoId}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComment(Guid videoId)
        {
            if (_context.Comment == null)
            {
                return NotFound();
            }
            return await _context.Comment
                .Where(x => x.VideoId == videoId)
                .OrderByDescending(x => x.Created)
                .Include(x => x.User)
                .Select(x => new CommentDTO
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    VideoId = x.VideoId,
                    Text = x.Text,
                    Created = x.Created,
                    User = x.User.ToDTO()
                })
                .ToListAsync();
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(Guid id, CommentPutDTO commentDTO)
        {
            if (_context.Comment == null)
            {
                return NotFound();
            }
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            _context.Entry(comment).State = EntityState.Modified;
            comment.Text = commentDTO.Text;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostComment(CommentPostDTO commentDTO)
        {
            if (_context.Comment == null)
            {
                return Problem("Entity set 'MyDbContext.Comment'  is null.");
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var comment = new Comment()
            {
                Created = DateTime.Now,
                Text = commentDTO.Text,
                VideoId = commentDTO.VideoId,
                UserId = (Guid)userId
            };
            _context.Comment.Add(comment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok();
        }

        // DELETE: api/Comments/5
        [Authorize(Roles = RoleNames.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            if (_context.Comment == null)
            {
                return NotFound();
            }
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }
            var userId = User.GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            _context.Comment.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
