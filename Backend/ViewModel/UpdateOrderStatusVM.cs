using course_work_backend.Model;

namespace course_work_backend.ViewModel
{
    public class UpdateOrderStatusVM
    {
        public int OrderId { get; set; }
        public OrderStatus NewStatus { get; set; }
    }
}