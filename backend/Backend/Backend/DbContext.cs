﻿using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
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

        builder.Entity<Role>().HasData(new[] {
            new Role()
            {
                Id = Guid.NewGuid(),
                Name = "Admin",
                NormalizedName = RoleNames.Admin
            },
            new Role()
            {
                Id = Guid.NewGuid(),
                Name = "User",
                NormalizedName = RoleNames.User
            },
            new Role()
            {
                Id = Guid.NewGuid(),
                Name = "Editor",
                NormalizedName = RoleNames.Editor
            }
        });

    }
    public DbSet<User> Users { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<UserVideoStats> UserVideoStats { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Channel> Channels { get; set; }
    public DbSet<ChannelAdvancedInfo> ChannelAdvancedInfos { get; set; }
    public DbSet<ChannelUserSpecificInfo> ChannelUserSpecificInfos { get; set; }
    public DbSet<Backend.Models.Comment>? Comment { get; set; }

}
