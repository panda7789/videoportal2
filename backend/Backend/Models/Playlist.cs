using Backend.Controllers;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
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
        public ICollection<PlaylistVideo>? Videos { get; set; }
        public User Owner { get; set; }
        public bool Public { get; set; }
        public ICollection<Permission> Permissions { get; set; }

        public PlaylistBasicInfoDTO ToBasicDTO()
        {
            return new PlaylistBasicInfoDTO(
                Id: Id,
                CreatedTimestamp: CreatedTimestamp,
                Description: Description,
                Name: Name,
                Owner: Owner.ToDTO(),
                ThumbnailUrl: ThumbnailUrl,
                FirstVideoThumbnailUrl: Videos?.Any() ?? false ? Videos.First().Video.ImageUrl : null,
                FirstVideoId: Videos?.Any() ?? false ? Videos.First().Video.Id : null,
                VideoCount: Videos?.Count() ?? 0,
                TotalDuration: Videos?.Any() ?? false ? Videos.Select(x => x.Video.Duration).Sum() : TimeSpan.Zero);
        }

        public PlaylistDTO ToDTO()
        {
            return new PlaylistDTO(
                Videos: (Videos?.Any() ?? false) ? Videos.OrderBy(x => x.Order).Select(x => x.Video.ToDTO()).ToList() : null,
                Id: Id,
                CreatedTimestamp: CreatedTimestamp,
                Description: Description,
                Name: Name,
                Owner: Owner.ToDTO(),
                ThumbnailUrl: ThumbnailUrl,
                TotalDuration: Videos?.Any() ?? false ? Videos.Select(x => x.Video.Duration).Sum() : TimeSpan.Zero,
                IsPublic: Public,
                IsReadOnly: Name == PlaylistsController.WatchLaterPlaylistName
            );
        }
    }

    [PrimaryKey(nameof(PlaylistId), nameof(VideoId))]
    public class PlaylistVideo
    {
        public Guid PlaylistId { get; set; }
        public Playlist Playlist { get; set; }

        public Guid VideoId { get; set; }
        public Video Video { get; set; }

        public int Order { get; set; }
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
        bool IsPublic,
        bool IsReadOnly
    );

    public class PlaylistPostPutDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Thumbnail { get; set; }
        public ICollection<Guid>? Videos { get; set; }
        public bool IsPublic { get; set; }
        public ObjectPermissions? Permissions { get; set; }
    }
}
