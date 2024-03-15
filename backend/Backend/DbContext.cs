using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Reflection.Emit;
using System.Reflection.Metadata;

public class MyDbContext : IdentityDbContext<User, Role, Guid>
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Role>().HasData(new[] {
            new Role()
            {
                Id = new Guid("EF1279C9-4E92-447F-8617-924E536BE6F1"),
                Name = "Admin",
                NormalizedName = RoleNames.Admin
            },
            new Role()
            {
                Id = new Guid("DF782EF4-097C-4BC5-9EE3-E65F1863FCF8"),
                Name = "User",
                NormalizedName = RoleNames.User
            },
            new Role()
            {
                Id = new Guid("3AC3367C-F9FF-44D9-BE8F-8BDC5377FA46"),
                Name = "Editor",
                NormalizedName = RoleNames.Editor
            }
        });

        builder.Entity<UserGroup>().HasData(new[]
        {
            new UserGroup()
            {
                Id = new Guid("1C1CA62B-EAF1-4E7A-9F19-CDD4CF52615A"),
                Name = "Administrátoři",
                OwnerGroupId = new Guid("1C1CA62B-EAF1-4E7A-9F19-CDD4CF52615A")
            }
        });

        builder.Entity<User>(u =>
        {
            var admin = new User
            {
                Id = new Guid("6B3E53EA-CEBF-42F3-BADB-DC9EE8EB064D"),
                Email = "admin@admin.cz",
                NormalizedEmail = "admin@admin.cz",
                NormalizedUserName = "admin@admin.cz",
                UserName = "admin@admin.cz",
                Name = "Administrátor",
                Initials = "A",
            };
            var passHash = new PasswordHasher<User>();
            admin.PasswordHash = passHash.HashPassword(admin, "1234");
            u.HasData(admin);


            u.OwnsOne(e => e.Roles)
                .HasData(new
                {
                    UserId = new Guid("6B3E53EA-CEBF-42F3-BADB-DC9EE8EB064D"),
                    User = true,
                    Administrator = true,
                    VideoEditor = false
                });
            u.HasMany(e => e.UserGroups)
            .WithMany(e => e.Users)
            .UsingEntity(e => e.HasData(new
            {
                UserGroupsId = new Guid("1C1CA62B-EAF1-4E7A-9F19-CDD4CF52615A"),
                UsersId = new Guid("6B3E53EA-CEBF-42F3-BADB-DC9EE8EB064D")
            }));
        });

        builder.Entity<IdentityUserRole<Guid>>().HasData(
            new IdentityUserRole<Guid>()
            {
                RoleId = new Guid("EF1279C9-4E92-447F-8617-924E536BE6F1"),
                UserId = new Guid("6B3E53EA-CEBF-42F3-BADB-DC9EE8EB064D")
            });

        builder.Entity<PlaylistVideo>()
            .HasKey(p => new {p.PlaylistId, p.VideoId });
        builder.Entity<Video>()
            .HasOne(e => e.MainPlaylist);
        builder.Entity<User>()
            .HasOne(e => e.WatchLaterPlaylist).WithOne().HasForeignKey<User>(e => e.WatchLaterPlaylistId);
        builder.Entity<Video>().Navigation(e => e.MainPlaylist).AutoInclude();
        builder.Entity<Video>().Navigation(e => e.Tags).AutoInclude();
        builder.Entity<Video>().Navigation(e => e.Owner).AutoInclude();
        builder.Entity<Video>().Navigation(e => e.Permissions).AutoInclude();
        builder.Entity<Video>().Navigation(e => e.UserVideoStats).AutoInclude();
        builder.Entity<Playlist>().Navigation(e => e.Permissions).AutoInclude();
        builder.Entity<Playlist>().Navigation(e => e.Owner).AutoInclude();
        builder.Entity<PlaylistVideo>().Navigation(e => e.Video).AutoInclude();
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<UserVideoStats> UserVideoStats { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<Comment>? Comment { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<PlaylistVideo> PlaylistVideo { get; set; }


}
