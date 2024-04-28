using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
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
        public virtual Video Video { get; set; }

        public UserVideoStatsDTO ToDTO() => new(
            Like: Like,
            Dislike: Dislike,
            AddedToPlaylist: AddedToPlaylist,
            TimeWatchedSec: TimeWatchedSec,
            UserId: UserId,
            VideoId: VideoId);
    }

    public record UserVideoStatsDTO(
        [property : Description("Příznak, zda přihlášený uživatel má u videa like.")]
        bool Like,
        [property : Description("Příznak, zda přihlášený uživatel má u videa dislike.")]
        bool Dislike,
        [property : Description("Příznak, zda si přihlášený uživatel video přidal do playlistu přehrát později.")]
        bool AddedToPlaylist,
        [property : Description("Celkový čas, který uživatel z videa již viděl. Slouží pro pokračování přehrávání tam, kde uživatel skončil.")]
        int TimeWatchedSec,
        Guid UserId,
        Guid VideoId
        );

    public record LikeDislikeStats(
        int LikeCount,
               int DislikeCount
               );


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
        public ICollection<Playlist>? Playlists { get; set; }
        public Playlist MainPlaylist { get; set; }
        public User Owner { get; set; }
        public ICollection<Permission> Permissions { get; set; }
        public ICollection<UserVideoStats> UserVideoStats { get; set; }
        
        public VideoDTO ToDTO() => new VideoDTO(
                Id: Id,
                Name: Name,
                ImageUrl: ImageUrl,
                Duration: Duration,
                Description: Description,
                DataUrl: DataUrl,
                LikeCount: UserVideoStats.Count(x => x.Like),
                DislikeCount: UserVideoStats.Count(x => x.Dislike),
                Views: UserVideoStats.Count,
                UploadTimestamp: UploadTimestamp,
                Tags: Tags?.Select(x => x.ToDTO()).ToList(),
                Playlists: null,
                MainPlaylistId: MainPlaylist.Id,
                MainPlaylistName: MainPlaylist.Name,
                Owner: Owner.ToDTO(),
                IsEmpty: Owner.Id == Guid.Empty
            );
    }
    public class ModifyVideoDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public Guid PlaylistId { get; set; }
        public ICollection<string>? Tags { get; set; }
        public ObjectPermissions? IncludedPermissions { get; set; }
        public ObjectPermissions? ExcludedPermissions { get; set; }

    }
    public class PostVideoRequest
    {
        public string FileName { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int DurationSec { get; set; }
        public IFormFile Image { get; set; }
        public Guid PlaylistId { get; set; }
        public ICollection<string>? Tags { get; set; }

        public ObjectPermissions? IncludedPermissions { get; set; }
        public ObjectPermissions? ExcludedPermissions { get; set; }
    }

    public class PostVideoResponse
    {
        public string DataUrl { get; set; }

    }
    public record VideoDTO(
        Guid Id,
        string Name,
        [property: Description("Odkaz na náhledový obrázek videa.")]
        string ImageUrl,
        TimeSpan Duration,
        string? Description,
        [property: Description("Odkaz na surová data videa.")]
        string DataUrl,
        int LikeCount,
        int DislikeCount,
        int Views,
        DateTime UploadTimestamp,
        [property : Description("Kolekce tagů, které video má.")]
        ICollection<TagDTO>? Tags,
        [property: Description("Původní atribut pro seznam playlistů obsahující tohle video, avšak nyní je nahrazeno atributem MainPlaylistId")]
        ICollection<PlaylistDTO>? Playlists,
        [property : Description("Id playlistu, do kterého video patří.")]
        Guid MainPlaylistId,
        [property : Description("Název playlistu, do kterého video patří.")]
        string MainPlaylistName,
        [property : Description("Uživatelská data o vlastníkovi videa.")]
        UserDTO Owner,
        [property : Description("Příznak, zdali se jedná o video na které nemá uživatel právo.")]
        bool? IsEmpty = false
        );

    public record ObjectPermissions(
        ICollection<Guid>? UserIds,
        ICollection<Guid>? GroupIds);

    public record IncludeExcludeObjectPermissions(
        [property : Description("Kolekce uživatelů a skupin, které mají na objekt právo.")]
        ObjectPermissions? IncludedPermissions,
        [property : Description("Kolekce uživatelů a skupin, které nemají na objekt právo.")]
        ObjectPermissions? ExcludedPermissions
        );
}
