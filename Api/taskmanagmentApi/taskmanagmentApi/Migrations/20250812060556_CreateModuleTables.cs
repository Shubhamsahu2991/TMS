using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace taskmanagmentApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateModuleTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjecteId",
                table: "Modules",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjecteId",
                table: "Modules");
        }
    }
}
