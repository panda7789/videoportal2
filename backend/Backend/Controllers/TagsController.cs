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
        public async Task<IActionResult> PostTag([FromBody] string name)
        {
            if (_context.Tags == null)
            {
                return Problem("Entity set 'MyDbContext.Tags'  is null.");
            }
            if (_context.Tags.Any(x => x.Name == name))
            {
                return Problem("Tag with this name already exists.");
            }
            _context.Tags.Add(new Tag() { Name= name});
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
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
