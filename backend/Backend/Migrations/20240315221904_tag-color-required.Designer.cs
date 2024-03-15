﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(MyDbContext))]
    [Migration("20240315221904_tag-color-required")]
    partial class tagcolorrequired
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Backend.Models.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Comment");
                });

            modelBuilder.Entity("Backend.Models.Permission", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<bool?>("OverridedEnableWatch")
                        .HasColumnType("tinyint(1)");

                    b.Property<Guid?>("PlaylistId")
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("UserGroupId")
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("VideoId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("PlaylistId");

                    b.HasIndex("UserGroupId");

                    b.HasIndex("UserId");

                    b.HasIndex("VideoId");

                    b.ToTable("Permissions");
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedTimestamp")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("char(36)");

                    b.Property<bool>("Public")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("ThumbnailUrl")
                        .HasColumnType("longtext");

                    b.Property<Guid?>("VideoId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("VideoId");

                    b.ToTable("Playlists");
                });

            modelBuilder.Entity("Backend.Models.PlaylistVideo", b =>
                {
                    b.Property<Guid>("PlaylistId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("char(36)");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.HasKey("PlaylistId", "VideoId");

                    b.HasIndex("VideoId");

                    b.ToTable("PlaylistVideo");
                });

            modelBuilder.Entity("Backend.Models.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                            ConcurrencyStamp = "6f565882-6fd0-43d2-ba41-f54401a80911",
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                            ConcurrencyStamp = "6ac4c6e7-9458-4569-8047-8b6570622815",
                            Name = "User",
                            NormalizedName = "USER"
                        },
                        new
                        {
                            Id = new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                            ConcurrencyStamp = "86684e48-c9a6-412b-bfbf-6772fb06b8d1",
                            Name = "Editor",
                            NormalizedName = "EDITOR"
                        });
                });

            modelBuilder.Entity("Backend.Models.Tag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Initials")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("longtext");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<Guid?>("WatchLaterPlaylistId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.HasIndex("WatchLaterPlaylistId")
                        .IsUnique();

                    b.ToTable("AspNetUsers", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                            AccessFailedCount = 0,
                            ConcurrencyStamp = "a00e9f0f-4b61-4e62-9b5c-d3303ab27bd5",
                            Email = "admin@admin.cz",
                            EmailConfirmed = false,
                            Initials = "A",
                            LockoutEnabled = false,
                            Name = "Administrátor",
                            NormalizedEmail = "admin@admin.cz",
                            NormalizedUserName = "admin@admin.cz",
                            PasswordHash = "AQAAAAEAACcQAAAAEErpi+b0zqlv0fXDPeojBVBzsZn8uCLe3eamwxypjvaA7OBpLjvkwIjEMyJwf39wgA==",
                            PhoneNumberConfirmed = false,
                            TwoFactorEnabled = false,
                            UserName = "admin@admin.cz"
                        });
                });

            modelBuilder.Entity("Backend.Models.UserGroup", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid?>("OwnerGroupId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.ToTable("UserGroups");

                    b.HasData(
                        new
                        {
                            Id = new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a"),
                            Name = "Administrátoři",
                            OwnerGroupId = new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a")
                        });
                });

            modelBuilder.Entity("Backend.Models.UserVideoStats", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideoId")
                        .HasColumnType("char(36)");

                    b.Property<bool>("AddedToPlaylist")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("Dislike")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("Like")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("TimeWatchedSec")
                        .HasColumnType("int");

                    b.HasKey("UserId", "VideoId");

                    b.HasIndex("VideoId");

                    b.ToTable("UserVideoStats");
                });

            modelBuilder.Entity("Backend.Models.Video", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("DataUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<int>("DislikeCount")
                        .HasColumnType("int");

                    b.Property<TimeSpan>("Duration")
                        .HasColumnType("time(6)");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("LikeCount")
                        .HasColumnType("int");

                    b.Property<Guid>("MainPlaylistId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("UploadTimestamp")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Views")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MainPlaylistId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Videos");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("longtext");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("char(36)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);

                    b.HasData(
                        new
                        {
                            UserId = new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                            RoleId = new Guid("ef1279c9-4e92-447f-8617-924e536be6f1")
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("TagVideo", b =>
                {
                    b.Property<Guid>("TagsId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideosId")
                        .HasColumnType("char(36)");

                    b.HasKey("TagsId", "VideosId");

                    b.HasIndex("VideosId");

                    b.ToTable("TagVideo");
                });

            modelBuilder.Entity("UserUserGroup", b =>
                {
                    b.Property<Guid>("UserGroupsId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("UsersId")
                        .HasColumnType("char(36)");

                    b.HasKey("UserGroupsId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("UserUserGroup");

                    b.HasData(
                        new
                        {
                            UserGroupsId = new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a"),
                            UsersId = new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d")
                        });
                });

            modelBuilder.Entity("Backend.Models.Comment", b =>
                {
                    b.HasOne("Backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Permission", b =>
                {
                    b.HasOne("Backend.Models.Playlist", "Playlist")
                        .WithMany("Permissions")
                        .HasForeignKey("PlaylistId");

                    b.HasOne("Backend.Models.UserGroup", "UserGroup")
                        .WithMany()
                        .HasForeignKey("UserGroupId");

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.HasOne("Backend.Models.Video", "Video")
                        .WithMany("Permissions")
                        .HasForeignKey("VideoId");

                    b.Navigation("Playlist");

                    b.Navigation("User");

                    b.Navigation("UserGroup");

                    b.Navigation("Video");
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.HasOne("Backend.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Video", null)
                        .WithMany("Playlists")
                        .HasForeignKey("VideoId");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Backend.Models.PlaylistVideo", b =>
                {
                    b.HasOne("Backend.Models.Playlist", "Playlist")
                        .WithMany("Videos")
                        .HasForeignKey("PlaylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Video", "Video")
                        .WithMany()
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Playlist");

                    b.Navigation("Video");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
                    b.HasOne("Backend.Models.Playlist", "WatchLaterPlaylist")
                        .WithOne()
                        .HasForeignKey("Backend.Models.User", "WatchLaterPlaylistId");

                    b.OwnsOne("Backend.Models.UserRoles", "Roles", b1 =>
                        {
                            b1.Property<Guid>("UserId")
                                .HasColumnType("char(36)");

                            b1.Property<bool>("Administrator")
                                .HasColumnType("tinyint(1)");

                            b1.Property<bool>("User")
                                .HasColumnType("tinyint(1)");

                            b1.Property<bool>("VideoEditor")
                                .HasColumnType("tinyint(1)");

                            b1.HasKey("UserId");

                            b1.ToTable("AspNetUsers");

                            b1.WithOwner()
                                .HasForeignKey("UserId");

                            b1.HasData(
                                new
                                {
                                    UserId = new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                                    Administrator = true,
                                    User = true,
                                    VideoEditor = false
                                });
                        });

                    b.Navigation("Roles")
                        .IsRequired();

                    b.Navigation("WatchLaterPlaylist");
                });

            modelBuilder.Entity("Backend.Models.UserVideoStats", b =>
                {
                    b.HasOne("Backend.Models.Video", "Video")
                        .WithMany("UserVideoStats")
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Video");
                });

            modelBuilder.Entity("Backend.Models.Video", b =>
                {
                    b.HasOne("Backend.Models.Playlist", "MainPlaylist")
                        .WithMany()
                        .HasForeignKey("MainPlaylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MainPlaylist");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("Backend.Models.Role", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("Backend.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("Backend.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("Backend.Models.Role", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("Backend.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TagVideo", b =>
                {
                    b.HasOne("Backend.Models.Tag", null)
                        .WithMany()
                        .HasForeignKey("TagsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Video", null)
                        .WithMany()
                        .HasForeignKey("VideosId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("UserUserGroup", b =>
                {
                    b.HasOne("Backend.Models.UserGroup", null)
                        .WithMany()
                        .HasForeignKey("UserGroupsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.Playlist", b =>
                {
                    b.Navigation("Permissions");

                    b.Navigation("Videos");
                });

            modelBuilder.Entity("Backend.Models.Video", b =>
                {
                    b.Navigation("Permissions");

                    b.Navigation("Playlists");

                    b.Navigation("UserVideoStats");
                });
#pragma warning restore 612, 618
        }
    }
}