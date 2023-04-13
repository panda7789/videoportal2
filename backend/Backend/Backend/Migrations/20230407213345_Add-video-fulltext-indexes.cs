using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class Addvideofulltextindexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE Videos ADD FULLTEXT fulltext_name_index(Name);");
            migrationBuilder.Sql(
                @"ALTER TABLE Videos ADD FULLTEXT fulltext_description_index(Description);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE Videos DROP INDEX fulltext_name_index;");
            migrationBuilder.Sql(
                @"ALTER TABLE Videos DROP INDEX fulltext_description_index;");
        }
    }
}
