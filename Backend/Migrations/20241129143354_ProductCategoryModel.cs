using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace course_work_backend.Migrations
{
    /// <inheritdoc />
    public partial class ProductCategoryModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductCategories' AND xtype='U')
        BEGIN
            CREATE TABLE ProductCategories (
                Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
                Name NVARCHAR(MAX),
                Description NVARCHAR(MAX),
                Image NVARCHAR(MAX)
            )
        END");
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
