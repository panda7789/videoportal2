using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public async Task<ActionResult<WithTotalCount<VideoDTO>>> Search([FromQuery] string q, [FromQuery] int? limit = null, int? offset = null)
        {
            if (_context.Videos == null)
            {
                return NotFound();
            }
            if (string.IsNullOrEmpty(q))
            {
                return Problem(statusCode: StatusCodes.Status400BadRequest, detail: "Neplatné vyhledávání");
            }
            var isTagSearch = q.StartsWith("tags:");
            IQueryable<Video> query;
            if (isTagSearch)
            {
                var tags = q.Replace("tags:", "").ToLower().Split(';');
                var tagsOfInterest = _context.Tags.Where(x => tags.Contains(x.Name.ToLower()));
                query = _context.Videos.Where(x => x.Tags.Any(y => tagsOfInterest.Contains(y)));
            }
            else
            {
                q = q.Length <= 10 ? q : q.Substring(0, 10);
                query = _context.Videos.FromSql($@"SELECT
                          (MATCH(name) AGAINST({q}) +
                           MATCH(description) AGAINST({q})) as Relevance,
                          v.*
                        FROM Videos as v
                        WHERE (MATCH(name) AGAINST({q}) +
                           MATCH(description) AGAINST({q})) != 0
                        ORDER BY Relevance desc, UploadTimestamp desc")
                    .AsNoTracking();
            }

            query = query.ApplyPermissions(this, _context);
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
            var videos = await query
                .Select(x => x.ToDTO())
                .ToListAsync();

            if (videos.Count == 0)
            {
                return NotFound();
            }

            return new WithTotalCount<VideoDTO>() { Items = videos, TotalCount = totalCount };
        }
    }
}

