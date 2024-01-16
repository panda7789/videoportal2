using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class videopermission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "6e3c766d-41ef-4f69-9664-6c0a98723ffb");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "c4e2110e-bcb0-4cac-93c7-8e9d8a53d4c1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "0ca941a0-aed5-43b1-ae64-6dfae7beb0f6");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "7b9a80f2-3263-4d38-9af8-ac3460d90377", "AQAAAAEAACcQAAAAEJfdeRXUhE2QGrtJ7jdXgfz60IPOy9XFXYry3DQllhK2aDu5kUzd/1rRRXpdXJ+dZA==" });
        }
    }
}
