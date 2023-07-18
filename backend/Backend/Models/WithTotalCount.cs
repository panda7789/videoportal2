using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Backend.Models
{
    public class WithTotalCount<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
