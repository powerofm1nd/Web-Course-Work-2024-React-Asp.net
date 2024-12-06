using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace course_work_backend.Model
{
    public class OrderModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual UserModel User { get; set; }

        public virtual ICollection<OrderItemModel> OrderItems { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.InProgress;
    }

    public enum OrderStatus
    {
        [Display(Name = "Виконано")]
        Completed,

        [Display(Name = "В роботі")]
        InProgress,

        [Display(Name = "Відмінено")]
        Canceled
    }
}
