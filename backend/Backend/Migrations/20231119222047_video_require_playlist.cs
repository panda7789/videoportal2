using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class video_require_playlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos");

            migrationBuilder.AlterColumn<Guid>(
                name: "MainPlaylistId",
                table: "Videos",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "03a00c6c-55d3-40e7-ab6a-58d016dcd060");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "6e3cf34f-af70-45c3-9eeb-f8a616e8223f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "87c2a4a4-7652-41b6-b4a5-d16d9bbd8558");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "c0515990-fb96-4c36-8070-39d9124c69f9", "AQAAAAEAACcQAAAAEIknGxKZZqs2k3PJq7iv8GUwDKqOkD3d3whpCcTi9hDeJwSrHf9rEV0l9kCuJ0liRQ==" });

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos",
                column: "MainPlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos");

            migrationBuilder.AlterColumn<Guid>(
                name: "MainPlaylistId",
                table: "Videos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Playlists_MainPlaylistId",
                table: "Videos",
                column: "MainPlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id");
        }
    }
}
