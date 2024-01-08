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
        public User Owner { get; set; }
        public bool Public { get; set; }

        public PlaylistBasicInfoDTO ToBasicDTO()
        {
            return new PlaylistBasicInfoDTO(
                Id: Id,
                CreatedTimestamp: CreatedTimestamp,
                Description: Description,
                Name: Name,
                Owner: Owner.ToDTO(),
                ThumbnailUrl: ThumbnailUrl,
                FirstVideoThumbnailUrl: Videos?.Any() ?? false ? Videos.First().ImageUrl : null,
                FirstVideoId: Videos?.Any() ?? false ? Videos.First().Id : null,
                VideoCount: Videos?.Count ?? 0,
                TotalDuration: Videos?.Any() ?? false ? Videos.Select(x => x.Duration).Sum() : TimeSpan.Zero);
        }

        public PlaylistDTO ToDTO()
        {
            return new PlaylistDTO(
                Videos: (Videos?.Any() ?? false) ? Videos.Select(x => x.ToDTO()).ToList() : null,
                Id: Id,
                CreatedTimestamp: CreatedTimestamp,
                Description: Description,
                Name: Name,
                Owner: Owner.ToDTO(),
                ThumbnailUrl: ThumbnailUrl,
                TotalDuration: Videos?.Any() ?? false ? Videos.Select(x => x.Duration).Sum() : TimeSpan.Zero,
                IsPublic: Public
            );
        }
    }

    public record PlaylistBasicInfoDTO(
         Guid Id,
        string Name,
        DateTime CreatedTimestamp,
        string? Description,
        string? ThumbnailUrl,
        string? FirstVideoThumbnailUrl,
        Guid? FirstVideoId,
        UserDTO Owner,
        TimeSpan TotalDuration,
        int VideoCount);

    public record PlaylistDTO(
        Guid Id,
        string Name,
        DateTime CreatedTimestamp,
        string? Description,
        string? ThumbnailUrl,
        ICollection<VideoDTO>? Videos,
        UserDTO Owner,
        TimeSpan TotalDuration,
        bool IsPublic
    );

    public class PlaylistPostPutDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public ICollection<Video>? Videos { get; set; }
        public bool IsPublic { get; set; }
        public ObjectPermissions? Permissions { get; set; }
    }
}
