using System.ComponentModel.DataAnnotations;

namespace course_work_backend.Model
{
    public class ProductCategoryModel
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }
}
