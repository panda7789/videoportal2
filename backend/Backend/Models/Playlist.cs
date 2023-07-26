using Backend.Utils;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Playlist
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public ICollection<Video>? Videos { get; set; }
        public virtual User Owner { get; set; }

        [ForeignKey(nameof(Owner))]
        public Guid IdOwner { get; set; }
        public Channel? Channel { get; set; }
        public Guid? ChannelId { get; set; }

        public PlaylistDTO ToDTO()
        {
            return new PlaylistDTO()
            {
                Channel = Channel,
                Videos = Videos?.Any() ?? false ? Videos.Select(x => x.ToDTO()).ToList() : null,  
                Id = Id,
                CreatedTimestamp = CreatedTimestamp,
                Description = Description,
                Name = Name,
                OwnerId = Owner.Id,
                ThumbnailUrl = ThumbnailUrl,
                TotalDuration = Videos?.Any() ?? false ? Videos.Select(x => x.Duration).Sum() : TimeSpan.Zero
            };
            
        }
    }

    public class PlaylistDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedTimestamp { get; set; }
        public string? Description { get; set; }
        public string? ThumbnailUrl { get; set; }
        public ICollection<VideoDTO>? Videos { get; set; }
        public Guid OwnerId{ get; set; }
        public Channel? Channel { get; set; }
        public TimeSpan TotalDuration { get; set; }
    }

    public class PlaylistPostPutDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public ICollection<Video>? Videos { get; set; }
        public Guid? ChannelId { get; set; }
    }
}
