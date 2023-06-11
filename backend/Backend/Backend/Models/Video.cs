using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Runtime.Serialization;

namespace Backend.Models
{
    [PrimaryKey(nameof(UserId), nameof(VideoId))]

    public class UserVideoStats
    {
        public bool Like { get; set; }
        public bool Dislike { get; set; }
        public bool AddedToPlaylist { get; set; }
        public int TimeWatchedSec { get; set; }
        public Guid UserId { get; set; }
        public Guid VideoId { get; set; }
    }

    public class Video
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public TimeSpan Duration { get; set; }
        public string? Description { get; set; }
        public string DataUrl { get; set; }
        public int LikeCount { get; set; }
        public int DislikeCount { get; set; }
        public int Views { get; set; }
        public DateTime UploadTimestamp { get; set; }
        public ICollection<Tag>? Tags { get; set; }
        public Guid ChannelId { get; set; }
        public Channel Channel { get; set; }
        [JsonIgnore]
        public ICollection<Playlist>? Playlists { get; set; }

        public VideoDTO ToDTO()
        {
            return new VideoDTO()
            {
                Id = Id,
                Name = Name,
                ImageUrl = ImageUrl,
                Duration = Duration,
                Description = Description,
                DataUrl = DataUrl,
                LikeCount = LikeCount,
                DislikeCount = DislikeCount,
                Views = Views,
                UploadTimestamp = UploadTimestamp,
                Tags = Tags,
                ChannelId = ChannelId,
                ChannelName = Channel.Name,
                ChannelAvatarUrl = Channel.AvatarUrl,
            };
        }
    }

    public class VideoDTO: Video
    {
        public string ChannelName { get; set; }
        public string? ChannelAvatarUrl { get; set; }
    }
}
