using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class playlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PlaylistId",
                table: "Videos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ThumbnailUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OwnerId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Playlists_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "9b8eed8d-dc02-4fc3-9e07-cbd545e8ae0c");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "141ea9ad-5bfc-4e42-8e6b-04e7ac802e0b");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "5d0bb71f-5455-4a06-958b-4dcb6110d73f");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_PlaylistId",
                table: "Videos",
                column: "PlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_OwnerId",
                table: "Playlists",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Playlists_PlaylistId",
                table: "Videos",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Playlists_PlaylistId",
                table: "Videos");

            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Videos_PlaylistId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "PlaylistId",
                table: "Videos");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "42a2ded4-754b-4616-8d72-d6f8fd88b11f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "7fa1983e-35b2-4909-9e2a-16a8ec17ed38");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "daaeee99-85f3-49e5-9b99-a43e0107e740");
        }
    }
}
