using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class videomainplaylist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MainPlaylistId",
                table: "Videos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "9474b19d-c0e0-4652-ad06-2e6199064a7f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "510471df-d7de-443c-b21e-d55b86022714");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "99af6223-e478-44a1-b217-e9b7d195db02");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "dd6a743a-ea6b-41fb-8745-21822b534c0e", "AQAAAAEAACcQAAAAEGgb77B+k5q/hCV2g0SIjkXy4cugnqAW5yM7qALrVxKm3SMbOGpeRdoaimh6DyOd5w==" });

            migrationBuilder.CreateIndex(
                name: "IX_Videos_MainPlaylistId",
                table: "Videos",
                column: "MainPlaylistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos",
                column: "MainPlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_MainPlaylistId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "MainPlaylistId",
                table: "Videos");

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
    }
}
