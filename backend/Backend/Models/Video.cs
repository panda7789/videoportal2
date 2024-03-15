﻿using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
        string ImageUrl,
        TimeSpan Duration,
        string? Description,
        string DataUrl,
        int LikeCount,
        int DislikeCount,
        int Views,
        DateTime UploadTimestamp,
        ICollection<TagDTO>? Tags,
        ICollection<PlaylistDTO>? Playlists,
        Guid MainPlaylistId,
        string MainPlaylistName,
        UserDTO Owner,
        bool? IsEmpty = false
        );

    public record ObjectPermissions(
        ICollection<Guid>? UserIds,
        ICollection<Guid>? GroupIds);

    public record IncludeExcludeObjectPermissions(
        ObjectPermissions? IncludedPermissions,
        ObjectPermissions? ExcludedPermissions
        );
}
