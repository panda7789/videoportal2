using Backend.Utils;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;

namespace Backend.Models
{
    public class Channel: ChannelDTO
    {
        public virtual User Owner { get; set; }

        [ForeignKey(nameof(Owner))]
        public Guid IdOwner { get; set; }
        public ChannelDTO ToDTO()
        {
            return new ChannelDTO()
            {
                Name = Name,
                SubscribersCount = SubscribersCount,
                PosterUrl = PosterUrl,
                PinnedVideo = PinnedVideo,
                AvatarUrl = AvatarUrl
            };
        }
    }

    public class ChannelDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public long SubscribersCount { get; set; }
        public string? PosterUrl { get; set; }

        [ForeignKey(nameof(PinnedVideo))]
        public Guid? PinnedVideoId { get; set; }
        public Video? PinnedVideo { get; set; }
        public string? AvatarUrl { get; set; }

    }

    public class ChannelAdvancedInfo
    {
        public Guid Id { get; set; }
        public Guid ChannelId { get; set; }
        public string Description { get; set; }
        public long DateOfRegistration { get; set; }
        public string? Email { get; set; }
        public ICollection<Channel> RelatedChannels { get; set; }
    }

    public class ChannelPostRequest
    {
        public string Name { get; set; }
        public IFormFile? Poster { get; set; }
        public Guid? PinnedVideoId { get; set; }
        public IFormFile? Avatar { get; set; }
    }
}
