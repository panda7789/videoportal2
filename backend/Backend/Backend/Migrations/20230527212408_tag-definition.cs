using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class tagdefinition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Videos_VideoId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_VideoId",
                table: "Tags");

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

            migrationBuilder.DropColumn(
                name: "VideoId",
                table: "Tags");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Tags",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TagVideo",
                columns: table => new
                {
                    TagsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    VideosId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagVideo", x => new { x.TagsId, x.VideosId });
                    table.ForeignKey(
                        name: "FK_TagVideo_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TagVideo_Videos_VideosId",
                        column: x => x.VideosId,
                        principalTable: "Videos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("bfab7d6f-3496-46e5-8729-f4d2b6be9fea"), "1f337a94-d42f-4348-8f03-b84396bd45b1", "Editor", "EDITOR" },
                    { new Guid("dfec2f06-d5a8-47e2-bcea-a91c886cc36c"), "0d497618-7273-4540-b9be-d29778cf0165", "Admin", "ADMIN" },
                    { new Guid("e29318bd-fb80-4796-bd41-d44ff07614d3"), "3c1b4b9d-30ea-42a1-bc51-867ebeaba3c8", "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_TagVideo_VideosId",
                table: "TagVideo",
                column: "VideosId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagVideo");

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

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Tags");

            migrationBuilder.AddColumn<Guid>(
                name: "VideoId",
                table: "Tags",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { new Guid("1eec1871-5e7b-468d-92f1-d97eaaccb6de"), "c0049c63-684e-4943-9ffc-e10c2444e7cc", "Admin", "ADMIN" },
                    { new Guid("50d85fe8-8192-4d6c-82e9-159c94fdb72e"), "ac456354-b495-42b8-b0a8-fb584f877d76", "Editor", "EDITOR" },
                    { new Guid("b5b0acba-9675-4130-a674-98e154317202"), "aa60a9aa-34da-42f4-9f61-cc949f4ffc83", "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tags_VideoId",
                table: "Tags",
                column: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Videos_VideoId",
                table: "Tags",
                column: "VideoId",
                principalTable: "Videos",
                principalColumn: "Id");
        }
    }
}
