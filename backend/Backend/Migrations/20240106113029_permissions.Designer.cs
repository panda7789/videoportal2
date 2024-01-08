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
    [Migration("20240106113029_permissions")]
    partial class permissions
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

                    b.Property<Guid>("PlaylistId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("UserGroupId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideoId")
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

                    b.Property<string>("ThumbnailUrl")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Playlists");
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
                            ConcurrencyStamp = "7a4d37ce-4aa2-4c9d-bd7a-0b8ee74379fd",
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                            ConcurrencyStamp = "044bf2fa-58da-40a0-8823-f2dc0333022a",
                            Name = "User",
                            NormalizedName = "USER"
                        },
                        new
                        {
                            Id = new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                            ConcurrencyStamp = "b906f4e0-d09e-4905-b59f-fea3440d8744",
                            Name = "Editor",
                            NormalizedName = "EDITOR"
                        });
                });

            modelBuilder.Entity("Backend.Models.Tag", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

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

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                            AccessFailedCount = 0,
                            ConcurrencyStamp = "781732fd-8e23-4760-9b48-13cfbd4cb4f7",
                            Email = "admin@admin.cz",
                            EmailConfirmed = false,
                            Initials = "A",
                            LockoutEnabled = false,
                            Name = "Administrátor",
                            NormalizedEmail = "admin@admin.cz",
                            NormalizedUserName = "admin@admin.cz",
                            PasswordHash = "AQAAAAEAACcQAAAAECp6zNUKlr6qFhL+yIUOaqbM6FGxtfWlytIGqKVVjuyyqL+InCn3++y8tHKjCU90xQ==",
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

            modelBuilder.Entity("PlaylistVideo", b =>
                {
                    b.Property<Guid>("PlaylistsId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("VideosId")
                        .HasColumnType("char(36)");

                    b.HasKey("PlaylistsId", "VideosId");

                    b.HasIndex("VideosId");

                    b.ToTable("PlaylistVideo");
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
                        .WithMany()
                        .HasForeignKey("PlaylistId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.UserGroup", "UserGroup")
                        .WithMany()
                        .HasForeignKey("UserGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Video", "Video")
                        .WithMany()
                        .HasForeignKey("VideoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

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

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Backend.Models.User", b =>
                {
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

            modelBuilder.Entity("PlaylistVideo", b =>
                {
                    b.HasOne("Backend.Models.Playlist", null)
                        .WithMany()
                        .HasForeignKey("PlaylistsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Video", null)
                        .WithMany()
                        .HasForeignKey("VideosId")
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
#pragma warning restore 612, 618
        }
    }
}
