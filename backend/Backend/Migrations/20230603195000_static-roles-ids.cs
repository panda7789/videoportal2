using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class staticrolesids : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("bfab7d6f-3496-46e5-8729-f4d2b6be9fea"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("dfec2f06-d5a8-47e2-bcea-a91c886cc36c"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("e29318bd-fb80-4796-bd41-d44ff07614d3"));

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"), "42a2ded4-754b-4616-8d72-d6f8fd88b11f", "Editor", "EDITOR" },
                    { new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"), "7fa1983e-35b2-4909-9e2a-16a8ec17ed38", "User", "USER" },
                    { new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"), "daaeee99-85f3-49e5-9b99-a43e0107e740", "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"));

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("bfab7d6f-3496-46e5-8729-f4d2b6be9fea"), "1f337a94-d42f-4348-8f03-b84396bd45b1", "Editor", "EDITOR" },
                    { new Guid("dfec2f06-d5a8-47e2-bcea-a91c886cc36c"), "0d497618-7273-4540-b9be-d29778cf0165", "Admin", "ADMIN" },
                    { new Guid("e29318bd-fb80-4796-bd41-d44ff07614d3"), "3c1b4b9d-30ea-42a1-bc51-867ebeaba3c8", "User", "USER" }
                });
        }
    }
}
