using System.ComponentModel;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Backend.Models
{
    [Description("Struktura obalující seznam položek a jejich celkový počet. Používá se pro stránkování.")]
    public class WithTotalCount<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}
