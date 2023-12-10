using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class playlist_video_owner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_AspNetUsers_IdOwner",
                table: "Playlists");

            migrationBuilder.RenameColumn(
                name: "IdOwner",
                table: "Playlists",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Playlists_IdOwner",
                table: "Playlists",
                newName: "IX_Playlists_OwnerId");

            migrationBuilder.AddColumn<Guid>(
                name: "OwnerId",
                table: "Videos",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
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
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "f748976e-aa73-4176-bb1d-11e94ba29aa1", "AQAAAAEAACcQAAAAEDGKpqO3ynTN30NiLtVWu9A/PmPCyHFcCfehBlvhheI2ilyvo4s8vnpq1Ir9yMwtvA==" });

            migrationBuilder.CreateIndex(
                name: "IX_Videos_OwnerId",
                table: "Videos",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_AspNetUsers_OwnerId",
                table: "Playlists",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_AspNetUsers_OwnerId",
                table: "Videos",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_AspNetUsers_OwnerId",
                table: "Playlists");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_AspNetUsers_OwnerId",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_OwnerId",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Videos");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Playlists",
                newName: "IdOwner");

            migrationBuilder.RenameIndex(
                name: "IX_Playlists_OwnerId",
                table: "Playlists",
                newName: "IX_Playlists_IdOwner");

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
                name: "FK_Playlists_AspNetUsers_IdOwner",
                table: "Playlists",
                column: "IdOwner",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
