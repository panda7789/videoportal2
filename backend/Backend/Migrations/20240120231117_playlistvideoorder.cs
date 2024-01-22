using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class playlistvideoorder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistVideo_Playlists_PlaylistsId",
                table: "PlaylistVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistVideo_Videos_VideosId",
                table: "PlaylistVideo");

            migrationBuilder.RenameColumn(
                name: "VideosId",
                table: "PlaylistVideo",
                newName: "VideoId");

            migrationBuilder.RenameColumn(
                name: "PlaylistsId",
                table: "PlaylistVideo",
                newName: "PlaylistId");

            migrationBuilder.RenameIndex(
                name: "IX_PlaylistVideo_VideosId",
                table: "PlaylistVideo",
                newName: "IX_PlaylistVideo_VideoId");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "PlaylistVideo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "VideoId",
                table: "Playlists",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "c10b40e7-06fe-4abb-b614-d1f91e23f4f4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "892994ee-69b9-43ff-a86b-8bcf215e3f34");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "b2fb8d9f-052f-4e89-8b0d-22eb0b749503");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "02b98ca4-2c88-4e5e-9971-18ef4cfaaa5f", "AQAAAAEAACcQAAAAEIGmt9JWYtlsV59F81riEaI9ngaQ0j3cIei5LDG9Cn4uhOMHJl9qsDx4qO39ZxWg6w==" });

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_VideoId",
                table: "Playlists",
                column: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_Videos_VideoId",
                table: "Playlists",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistVideo_Playlists_PlaylistId",
                table: "PlaylistVideo",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistVideo_Videos_VideoId",
                table: "PlaylistVideo",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_Videos_VideoId",
                table: "Playlists");

            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistVideo_Playlists_PlaylistId",
                table: "PlaylistVideo");

            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistVideo_Videos_VideoId",
                table: "PlaylistVideo");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_VideoId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "PlaylistVideo");

            migrationBuilder.DropColumn(
                name: "VideoId",
                table: "Playlists");

            migrationBuilder.RenameColumn(
                name: "VideoId",
                table: "PlaylistVideo",
                newName: "VideosId");

            migrationBuilder.RenameColumn(
                name: "PlaylistId",
                table: "PlaylistVideo",
                newName: "PlaylistsId");

            migrationBuilder.RenameIndex(
                name: "IX_PlaylistVideo_VideoId",
                table: "PlaylistVideo",
                newName: "IX_PlaylistVideo_VideosId");

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
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "ed43e1ae-41ca-49d1-8e53-4a1b3f878c7d", "AQAAAAEAACcQAAAAEFN3s6hcemdXlndBU1g+aF3sQcfGVimA1Kx26ZsMxsq3yzrqASdUnP1oSaOdUgMtcQ==" });

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistVideo_Playlists_PlaylistsId",
                table: "PlaylistVideo",
                column: "PlaylistsId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistVideo_Videos_VideosId",
                table: "PlaylistVideo",
                column: "VideosId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
