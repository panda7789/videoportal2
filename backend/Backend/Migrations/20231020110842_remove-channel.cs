using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class removechannel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_Channels_ChannelId",
                table: "Playlists");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Channels_ChannelId",
                table: "Videos");

            migrationBuilder.DropForeignKey(
                name: "FK_ChannelAdvancedInfos_Channels_ChannelId",
                table: "ChannelAdvancedInfos");

            migrationBuilder.DropTable(
                name: "ChannelUserSpecificInfos");

            migrationBuilder.DropTable(
                name: "Channels");

            migrationBuilder.DropTable(
                name: "ChannelAdvancedInfos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_ChannelId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_ChannelId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "Playlists");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "da70b6d8-29f4-4a71-9c5c-8691dfc81d6f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "d7997ee2-4978-4b6c-a917-68573c34793f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "d59d4263-76e6-4986-a6bc-cca7f2a61096");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "d4b92d1b-defb-4410-b598-fb362604f35a", "AQAAAAEAACcQAAAAELkE+aOtKcdeoo4yLA2L6MaSzbtav5a8RnidpeLXlYpU25HbKsfFRTNTsuBT5uMteQ==" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ChannelId",
                table: "Videos",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ChannelId",
                table: "Playlists",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "ChannelUserSpecificInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ChannelId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Subscribed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelUserSpecificInfos", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ChannelAdvancedInfos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ChannelId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DateOfRegistration = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChannelAdvancedInfos", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Channels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    IdOwner = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PinnedVideoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    AvatarUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChannelAdvancedInfoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PosterUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubscribersCount = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Channels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Channels_AspNetUsers_IdOwner",
                        column: x => x.IdOwner,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Channels_ChannelAdvancedInfos_ChannelAdvancedInfoId",
                        column: x => x.ChannelAdvancedInfoId,
                        principalTable: "ChannelAdvancedInfos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Channels_Videos_PinnedVideoId",
                        column: x => x.PinnedVideoId,
                        principalTable: "Videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "f92a47a3-6a3a-405f-bec4-acfaafee4915");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "c8f7dd0b-9545-4746-b332-c042e8a94e45");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "2d305e33-62bc-4d7d-8478-5aa5ac874229");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "3ab94a5a-f312-40c4-bb15-b7870ee18e67", "AQAAAAEAACcQAAAAEJPsWudsO/iFj3FXMT6P3a8HWQIgbOu3hVOM2a16UWyqW+8End0/ExGGYBx81bWoOA==" });

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ChannelId",
                table: "Videos",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_ChannelId",
                table: "Playlists",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_ChannelAdvancedInfos_ChannelId",
                table: "ChannelAdvancedInfos",
                column: "ChannelId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Channels_ChannelAdvancedInfoId",
                table: "Channels",
                column: "ChannelAdvancedInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_IdOwner",
                table: "Channels",
                column: "IdOwner");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_PinnedVideoId",
                table: "Channels",
                column: "PinnedVideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_Channels_ChannelId",
                table: "Playlists",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Channels_ChannelId",
                table: "Videos",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ChannelAdvancedInfos_Channels_ChannelId",
                table: "ChannelAdvancedInfos",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
