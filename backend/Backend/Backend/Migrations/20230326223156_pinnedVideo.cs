using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class pinnedVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Channels_ChannelId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_ChannelId",
                table: "Videos");

            migrationBuilder.AddColumn<Guid>(
                name: "PinnedVideoId",
                table: "Channels",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_PinnedVideoId",
                table: "Channels",
                column: "PinnedVideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Channels_Videos_PinnedVideoId",
                table: "Channels",
                column: "PinnedVideoId",
                principalTable: "Videos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Channels_Videos_PinnedVideoId",
                table: "Channels");

            migrationBuilder.DropIndex(
                name: "IX_Channels_PinnedVideoId",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "PinnedVideoId",
                table: "Channels");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ChannelId",
                table: "Videos",
                column: "ChannelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Channels_ChannelId",
                table: "Videos",
                column: "ChannelId",
                principalTable: "Channels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
