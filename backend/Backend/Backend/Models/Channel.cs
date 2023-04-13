using Backend.Utils;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace Backend.Models
{
    public class Channel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public long SubscribersCount { get; set; }
        public string? PosterUrl { get; set; }
        public Guid? PinnedVideoId { get; set; }
        public Video? PinnedVideo { get; set; }
        public string? AvatarUrl { get; set; }
        public virtual User Owner { get; set; }

        [ForeignKey(nameof(Owner))]
        public Guid IdOwner { get; set; }

        public ChannelDTO ToDTO() => new ChannelDTO()
        {
            Id = Id,
            Name = Name,
            SubscribersCount = SubscribersCount,
            AvatarUrl = AvatarUrl,
            PosterUrl = PosterUrl,
            PinnedVideoId = PinnedVideoId,
            PinnedVideo = PinnedVideo,
        };
    }

    public class ChannelDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public long SubscribersCount { get; set; }
        public string? PosterUrl { get; set; }
        public Guid? PinnedVideoId { get; set; }
        public Video? PinnedVideo { get; set; }
        public string? AvatarUrl { get; set; }

    }

    public class ChannelAdvancedInfo
    {
        public Guid Id { get; set; }
        public Guid ChannelId { get; set; }
        public string? Description { get; set; }
        public DateTime DateOfRegistration { get; set; }

        // owner.email
        public string? Email { get; set; }
        public ICollection<Channel>? RelatedChannels { get; set; }
    }

    public class ChannelUserSpecificInfo
    {
        public Guid Id { get; set; }
        public Guid ChannelId { get; set; }
        public Guid UserId { get; set; }
        public bool Subscribed { get; set; } = false;

        public ChannelUserSpecificInfoDTO ToDTO() => new()
        {
            Subscribed = Subscribed
        };

    }

    public class ChannelUserSpecificInfoDTO
    {
        public bool Subscribed { get; set; } = false;
    }

    public class ChannelPostRequest
    {
        public string Name { get; set; }
        public IFormFile? Poster { get; set; }
        public Guid? PinnedVideoId { get; set; }
        public IFormFile? Avatar { get; set; }
        public string? Description { get; set; }
        public ICollection<Channel>? RelatedChannels { get; set; }
    }
}
