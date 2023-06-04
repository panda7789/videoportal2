using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class tagy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("999f41cc-778b-4539-95b7-9722a931b39d"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("d2b9aca2-dddc-46ed-976c-e23b5f7b3fd9"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("d82d8ea0-19f3-472d-b6a0-5f4c84e1162a"));

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Tags");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Tags",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("1eec1871-5e7b-468d-92f1-d97eaaccb6de"), "c0049c63-684e-4943-9ffc-e10c2444e7cc", "Admin", "ADMIN" },
                    { new Guid("50d85fe8-8192-4d6c-82e9-159c94fdb72e"), "ac456354-b495-42b8-b0a8-fb584f877d76", "Editor", "EDITOR" },
                    { new Guid("b5b0acba-9675-4130-a674-98e154317202"), "aa60a9aa-34da-42f4-9f61-cc949f4ffc83", "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("1eec1871-5e7b-468d-92f1-d97eaaccb6de"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("50d85fe8-8192-4d6c-82e9-159c94fdb72e"));

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("b5b0acba-9675-4130-a674-98e154317202"));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Tags",
                type: "int",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Tags",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("999f41cc-778b-4539-95b7-9722a931b39d"), "75bc0000-9683-4e24-9950-9df16d0f3a91", "User", "USER" },
                    { new Guid("d2b9aca2-dddc-46ed-976c-e23b5f7b3fd9"), "db79dbdd-62bf-4319-bdb8-b40f66dda5e7", "Admin", "ADMIN" },
                    { new Guid("d82d8ea0-19f3-472d-b6a0-5f4c84e1162a"), "d6097711-b1f3-48b6-8123-e30b022c02c8", "Editor", "EDITOR" }
                });
        }
    }
}
