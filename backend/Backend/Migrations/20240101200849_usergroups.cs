using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class usergroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_UserGroups_UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UserGroupId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<Guid>(
                name: "OwnerGroupId",
                table: "UserGroups",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "UserUserGroup",
                columns: table => new
                {
                    UserGroupsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsersId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserUserGroup", x => new { x.UserGroupsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_UserUserGroup_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserUserGroup_UserGroups_UserGroupsId",
                        column: x => x.UserGroupsId,
                        principalTable: "UserGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "f2e32e50-5705-49fe-8632-898c8cf80ad4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "9e911cf1-da27-42b9-a12c-adf198f45cf7");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "85e62747-1792-4036-b9ce-686f16050cad");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "NormalizedEmail", "NormalizedUserName", "PasswordHash" },
                values: new object[] { "9e3d336b-505e-4d15-8a94-c70773b5e6d8", "admin@admin.cz", "admin@admin.cz", "AQAAAAEAACcQAAAAEM6kVIV6Wfl4b/aUpzo6zqfyu+RW1PuWA6xBOF41e0iESIMy1+dye5m70JKsGCHhMw==" });

            migrationBuilder.InsertData(
                table: "UserGroups",
                columns: new[] { "Id", "Name", "OwnerGroupId" },
                values: new object[] { new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a"), "Administrátoři", new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a") });

            migrationBuilder.InsertData(
                table: "UserUserGroup",
                columns: new[] { "UserGroupsId", "UsersId" },
                values: new object[] { new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a"), new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d") });

            migrationBuilder.CreateIndex(
                name: "IX_UserUserGroup_UsersId",
                table: "UserUserGroup",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserUserGroup");

            migrationBuilder.DeleteData(
                table: "UserGroups",
                keyColumn: "Id",
                keyValue: new Guid("1c1ca62b-eaf1-4e7a-9f19-cdd4cf52615a"));

            migrationBuilder.DropColumn(
                name: "OwnerGroupId",
                table: "UserGroups");

            migrationBuilder.AddColumn<Guid>(
                name: "UserGroupId",
                table: "AspNetUsers",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("3ac3367c-f9ff-44d9-be8f-8bdc5377fa46"),
                column: "ConcurrencyStamp",
                value: "8de899b3-b76f-4419-8eae-881a61c68c33");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("df782ef4-097c-4bc5-9ee3-e65f1863fcf8"),
                column: "ConcurrencyStamp",
                value: "566f726f-d87a-4e28-abfb-3d1ae217e592");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("ef1279c9-4e92-447f-8617-924e536be6f1"),
                column: "ConcurrencyStamp",
                value: "1458ebe3-8a6f-4f91-a7fc-edcbbc7fe30a");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("6b3e53ea-cebf-42f3-badb-dc9ee8eb064d"),
                columns: new[] { "ConcurrencyStamp", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "UserGroupId" },
                values: new object[] { "f748976e-aa73-4176-bb1d-11e94ba29aa1", null, null, "AQAAAAEAACcQAAAAEDGKpqO3ynTN30NiLtVWu9A/PmPCyHFcCfehBlvhheI2ilyvo4s8vnpq1Ir9yMwtvA==", null });

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
    }
}
