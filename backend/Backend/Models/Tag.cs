using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Video> Videos { get; set; }
        public TagDTO ToDTO() => new()
        {
            Id = Id,
            Name = Name,
        };
    }

    public class TagDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
