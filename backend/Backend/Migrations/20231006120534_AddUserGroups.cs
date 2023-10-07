using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserGroupId",
                table: "AspNetUsers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "UserGroups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserGroups", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "f92a47a3-6a3a-405f-bec4-acfaafee4915");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "c8f7dd0b-9545-4746-b332-c042e8a94e45");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "2d305e33-62bc-4d7d-8478-5aa5ac874229");

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "Initials", "LockoutEnabled", "LockoutEnd", "Name", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserGroupId", "UserName", "Roles_Administrator", "Roles_User", "Roles_VideoEditor" },
                values: new object[] { new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"), 0, "3ab94a5a-f312-40c4-bb15-b7870ee18e67", "admin@admin.cz", false, "A", false, null, "Administrátor", null, null, "AQAAAAEAACcQAAAAEJPsWudsO/iFj3FXMT6P3a8HWQIgbOu3hVOM2a16UWyqW+8End0/ExGGYBx81bWoOA==", null, false, null, false, null, "admin@admin.cz", true, true, false });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_UserGroupId",
                table: "AspNetUsers",
                column: "UserGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_UserGroups_UserGroupId",
                table: "AspNetUsers",
                column: "UserGroupId",
                principalTable: "UserGroups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserGroups_UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "UserGroups");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"));

            migrationBuilder.DropColumn(
                name: "UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "1bb098ef-f313-4820-9424-d6d0bb0ecb4b");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "ee8ad545-548a-49f1-875c-54c2305feaa2");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "d186309d-bf24-4f68-81da-b1dc8dd3f19e");
        }
    }
}
