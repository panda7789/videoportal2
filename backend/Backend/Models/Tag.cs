using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Video> Videos { get; set; }
        public string Color { get; set; }
        public TagDTO ToDTO() => new()
        {
            Id = Id,
            Name = Name,
            Color = Color
        };
    }

    public class TagDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        [Description("Hex barva tagu.")]
        public string Color { get; set; }
    }

    public record class PostTagDTO
    {
        public string Name { get; set; }
        [Description("Hex barva tagu.")]
        public string Color { get; set; }
    }
}
