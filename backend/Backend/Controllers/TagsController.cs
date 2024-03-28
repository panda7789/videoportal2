using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public TagsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Tags
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagDTO>>> GetTagsDTO()
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            return await _context.Tags.Select(x => x.ToDTO()).ToListAsync();
        }

        [HttpGet("tagsWithVideos")]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTags()
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            return await _context.Tags.Include(x => x.Videos).ToListAsync();
        }

        // POST: api/Tags
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostTag([FromBody] PostTagDTO tag)
        {
            if (_context.Tags == null)
            {
                return Problem();
            }
            if (_context.Tags.Any(x => x.Name == tag.Name))
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: $"Tag s tímto názvem již existuje");
            }
            _context.Tags.Add(new Tag() { Name = tag.Name, Color = tag.Color });
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Tags/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            if (_context.Tags == null)
            {
                return NotFound();
            }
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return Problem(statusCode: StatusCodes.Status404NotFound, detail: "Tag nenalezen");
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
