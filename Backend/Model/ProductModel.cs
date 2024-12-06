using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using course_work_backend.Model;
public class ProductModel
{
    [Key]
    public int Id { get; set; }
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    [Required]
    [StringLength(2000)]
    public string FullDescription { get; set; }
    [Required]
    [StringLength(250)]
    public string ShortDescription { get; set; }
    [Required]
    public decimal Price { get; set; }
    public string MainImage { get; set; }
    public int? ProductCategoryId { get; set; }
    [ForeignKey("ProductCategoryId")]
    [JsonIgnore]
    public virtual ProductCategoryModel? ProductCategory { get; set; }
}