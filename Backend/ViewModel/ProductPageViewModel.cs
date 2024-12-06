using course_work_backend.Controllers;
using course_work_backend.Model;

namespace course_work_backend.ViewModel
{
    public class ProductPageViewModel
    {
        public ProductCategoryModel Category { get; set; }
        public List<ProductModel> ProductsOnPage { get; set; }
        public int CurrentPageNumber {  get; set; }
        public int TotalPageCount { get; set; }
        public bool IsHasNext { get { return CurrentPageNumber != TotalPageCount; }}
        public SortBy SortBy { get; set; }
    }
}
