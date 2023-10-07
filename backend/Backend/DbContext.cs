﻿using Backend.Models;
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

        builder.Entity<Channel>().HasOne(x => x.PinnedVideo).WithMany().HasForeignKey(x => x.PinnedVideoId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Video>().HasOne(x => x.Channel).WithMany().HasForeignKey(x => x.ChannelId).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<ChannelAdvancedInfo>()
                .HasOne(x => x.Channel)
                .WithOne();

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

        builder.Entity<User>(u =>
        {
            var admin = new User
            {
                Id = new Guid("6B3E53EA-CEBF-42F3-BADB-DC9EE8EB064D"),
                Email = "admin@admin.cz",
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
                    VideoEditor=false
                });
        });
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<UserVideoStats> UserVideoStats { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<ChannelAdvancedInfo> ChannelAdvancedInfos { get; set; }
    public DbSet<ChannelUserSpecificInfo> ChannelUserSpecificInfos { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<Backend.Models.Comment>? Comment { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }

}