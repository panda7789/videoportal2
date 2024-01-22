using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class addWatchLaterPlaylist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "WatchLaterPlaylistId",
                table: "AspNetUsers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "24de9787-713b-4069-b5d1-72069d7809e9");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "acabbc04-1c66-4fb7-8528-684a164cb2bd");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "4677e072-b6a1-4105-badf-e03f1c71c1ab");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "WatchLaterPlaylistId" },
                values: new object[] { "ed43e1ae-41ca-49d1-8e53-4a1b3f878c7d", "AQAAAAEAACcQAAAAEFN3s6hcemdXlndBU1g+aF3sQcfGVimA1Kx26ZsMxsq3yzrqASdUnP1oSaOdUgMtcQ==", null });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_WatchLaterPlaylistId",
                table: "AspNetUsers",
                column: "WatchLaterPlaylistId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Playlists_WatchLaterPlaylistId",
                table: "AspNetUsers",
                column: "WatchLaterPlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Playlists_WatchLaterPlaylistId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_WatchLaterPlaylistId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "WatchLaterPlaylistId",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "25396b86-ce7c-441c-bdc4-5e19a6f0d187");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "6c05e65d-2651-4e11-8617-7a0ab4f92097");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "eb3b8767-e46d-43e8-a711-8a0048b39650");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "367c8c40-bfb9-4df9-a725-701601e4b6f4", "AQAAAAEAACcQAAAAEDd4dDABUx/9IC/AlDTRy3Yx2xjgV0Hcz+zl+p2wo7cqo9+9q9LLzUEJeWuvK3HcbQ==" });
        }
    }
}
