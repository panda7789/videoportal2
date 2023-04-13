using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly MyDbContext _context;

        public SearchController(MyDbContext context)
        {
            _context = context;
        }
        [HttpPut("")]
        public async Task<ActionResult<IEnumerable<VideoDTO>>> Search([FromQuery] string q)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            if (string.IsNullOrEmpty(q))
            {
                return BadRequest();
            }
            q = q.Take(10).ToString();
            var videos = await _context.Videos.FromSql($@"SELECT
                      (MATCH(name) AGAINST('{q}') +
                       MATCH(description) AGAINST('{q}')) as Relevance,
                      v.*
                    FROM Videos as v
                    ORDER BY Relevance desc
                    LIMIT 10")
                .AsNoTracking()
                .Include(x => x.Channel)
                .Select(x => x.ToDTO())
                .ToListAsync();
            if (videos == null)
            {
                return NotFound();
            }

            return videos;
        }
    }
}

