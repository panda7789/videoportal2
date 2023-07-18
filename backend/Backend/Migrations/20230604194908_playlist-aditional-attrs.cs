using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class playlistaditionalattrs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ChannelId",
                table: "Playlists",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedTimestamp",
                table: "Playlists",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "3018e1d7-5845-45ff-9187-2fc50bfc2831");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "a298db12-731f-43fe-ac02-853adf458cab");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "8436f34a-4a68-4e0b-9482-08bd81273af9");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_ChannelId",
                table: "Playlists",
                column: "ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_Channels_ChannelId",
                table: "Playlists",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_Channels_ChannelId",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_ChannelId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "CreatedTimestamp",
                table: "Playlists");

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
        }
    }
}
