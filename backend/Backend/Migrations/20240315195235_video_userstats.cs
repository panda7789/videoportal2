using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class video_userstats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "fba20983-8651-409e-bf26-3555549b92d7");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "a0b2629a-2af2-4394-8ebf-6bacc004ca4c");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "0589789f-ec07-4943-9135-ae302f35de76");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "3d5acbce-5965-4192-80ff-41095a1bcddc", "AQAAAAEAACcQAAAAEFrRL2FTe4Cyx5gH04cXMjSiO9IDKS0kqtEwm/dn0yBDc9xyeMEHcJmb+wnZ+B/k0Q==" });

            migrationBuilder.CreateIndex(
                name: "IX_UserVideoStats_VideoId",
                table: "UserVideoStats",
                column: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserVideoStats_Videos_VideoId",
                table: "UserVideoStats",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserVideoStats_Videos_VideoId",
                table: "UserVideoStats");

            migrationBuilder.DropIndex(
                name: "IX_UserVideoStats_VideoId",
                table: "UserVideoStats");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "fbb4a16e-8e4f-4ec2-af6f-d8af042b0a65");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "b19ae4e9-e9d2-48f9-a9ae-0430213635d2");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "f5579219-5ae5-4867-8577-a7e4bd2311cf");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "1157ae0b-822c-4cf1-955e-f1766527b409", "AQAAAAEAACcQAAAAEEdJsrGA30aB7oHoYcFWuJio4kMLU1a8diJIuk/fH8IXQ7tD8XNzax1deK62Mqgr1A==" });
        }
    }
}
