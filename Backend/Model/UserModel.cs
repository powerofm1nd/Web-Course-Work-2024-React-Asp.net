using System.ComponentModel.DataAnnotations;

namespace course_work_backend.Model
{
    public enum UserRole
    {
        user,
        admin
    }

    public class UserModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Login { get; set; }
        [Required]
        public string HashPassword { get; set; }
        [Required]
        [StringLength(50)]
        public string Email { get; set; }
        [Required]
        public bool IsAdmin { get; set; }
    }
}