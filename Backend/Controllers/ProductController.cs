using course_work_backend.AppDBContext;
using course_work_backend.Model;
using course_work_backend.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace course_work_backend.Controllers
{
    public enum SortBy
    {
        SortByPriceAscend,
        SortByPriceDescend,
    }

    [ApiController]
    [Route("api/product")]  // Базовий маршрут для контролера
    public class ProductController : Controller
    {
        private readonly ApplicationDBContext _dbContext;
        private readonly IConfiguration _configuration;

        public ProductController(ApplicationDBContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // Для методу Categories() призначаємо окремий маршрут
        [HttpGet("categories")]  // Використовуємо атрибут HttpGet з вказівкою частини маршруту
        public ActionResult Categories()
        {
            var categories = _dbContext.ProductCategories.ToList();
            return Ok(categories);
        }

        [HttpGet("get")]
        public ActionResult Get(int productId)
        {
            try
            {
                var product = _dbContext.Products.First(c => c.Id == productId);

                if (product == null)
                {
                    return NotFound($"Продукт з ID {productId} не існує.");
                }

                return CreatedAtAction(nameof(Create), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }

        [HttpGet("getPage")]
        public ActionResult GetPage(int productCategoryId, int pageNumber, SortBy sortBy)
        {
            try
            {
                // Визначаємо кількість товарів на одній сторінці
                const int pageSize = 8;

                // Отримуємо товари з бази даних для вказаної категорії
                var productsQuery = _dbContext.Products
                    .Where(p => p.ProductCategoryId == productCategoryId);

                // Сортування товарів за параметром sortBy
                productsQuery = sortBy switch
                {
                    SortBy.SortByPriceAscend => productsQuery.OrderBy(p => p.Price), // За зростанням ціни
                    SortBy.SortByPriceDescend => productsQuery.OrderByDescending(p => p.Price), // За спаданням ціни
                    _ => productsQuery // Якщо сортування не задано, залишаємо як є
                };

                // Рахуємо загальну кількість товарів у категорії
                var totalProductsCount = productsQuery.Count();

                // Розрахунок загальної кількості сторінок
                var totalPages = (int)Math.Ceiling((double)totalProductsCount / pageSize);

                // Перевірка валідності номера сторінки
                if (pageNumber < 1 || pageNumber > totalPages)
                {
                    return BadRequest("Номер сторінки недійсний.");
                }

                // Отримуємо товари для поточної сторінки
                var productsOnPage = productsQuery
                    .Skip((pageNumber - 1) * pageSize) // Пропускаємо товари попередніх сторінок
                    .Take(pageSize) // Беремо товари для поточної сторінки
                    .ToList();

                // Отримуємо інформацію про категорію
                var category = _dbContext.ProductCategories
                    .FirstOrDefault(c => c.Id == productCategoryId);

                if (category == null)
                {
                    return NotFound("Категорію не знайдено.");
                }
                else
                {
                    // Формуємо модель сторінки
                    var pageModel = new ProductPageViewModel
                    {
                        Category = category, // Категорія
                        ProductsOnPage = productsOnPage, // Список товарів на сторінці
                        CurrentPageNumber = pageNumber, // Поточний номер сторінки
                        TotalPageCount = totalPages, // Загальна кількість сторінок
                        SortBy = sortBy // Тип сортування
                    };

                    // Повертаємо результат
                    return Ok(pageModel);
                }
            }
            catch (Exception ex)
            {
                // Обробка помилки та повернення повідомлення про внутрішню помилку сервера
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }


        [HttpPost("create")]
        public ActionResult Create(ProductModel product)
        {
            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];
                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Токен не знайдений.");
                }

                // Валідація токена і витягування claims
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"]
                };

                ClaimsPrincipal principal;
                try
                {
                    // Перевіряємо токен
                    principal = tokenHandler.ValidateToken(tokenString, tokenValidationParameters, out var validatedToken);

                    // Перевіряємо, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Невірний токен.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Валідація токена не вдалася: {ex.Message}");
                }

                // Перевірка ролі користувача
                var roleClaim = principal.FindFirst(ClaimTypes.Role);
                if (roleClaim == null || roleClaim.Value != UserRole.admin.ToString())
                {
                    return Forbid("Ви не маєте дозволу на створення товарів.");
                }

                // Перевірка моделі
                if (product == null)
                {
                    return BadRequest("Дані продукту відсутні.");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Перевіряємо, чи передано ID категорії
                if (!product.ProductCategoryId.HasValue)
                {
                    return BadRequest("ProductCategoryId є обов'язковим.");
                }

                // Перевіряємо, чи існує така категорія
                var categoryExists = _dbContext.ProductCategories
                    .Any(c => c.Id == product.ProductCategoryId.Value);
                if (!categoryExists)
                {
                    return NotFound($"Категорія з ID {product.ProductCategoryId} не існує.");
                }

                // Додавання продукту
                _dbContext.Products.Add(product);
                _dbContext.SaveChanges();

                return CreatedAtAction(nameof(Create), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }


        [HttpPost("delete/{productId}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];
                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Токен не знайдений.");
                }

                // Валідація токена і витягування claims
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]);
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"]
                };

                ClaimsPrincipal principal;
                try
                {
                    // Перевіряємо токен
                    principal = tokenHandler.ValidateToken(tokenString, tokenValidationParameters, out var validatedToken);

                    // Перевіряємо, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Невірний токен.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Валідація токена не вдалася: {ex.Message}");
                }

                // Перевірка ролі користувача
                var roleClaim = principal.FindFirst(ClaimTypes.Role);
                if (roleClaim == null || roleClaim.Value != UserRole.admin.ToString())
                {
                    return Forbid("Ви не маєте дозволу на видалення товарів.");
                }

                // Знаходимо товар по ID
                var product = await _dbContext.Products.FindAsync(productId);
                if (product == null)
                {
                    return NotFound($"Продукт з ID {productId} не знайдено.");
                }

                // Видалення товару
                _dbContext.Products.Remove(product);
                await _dbContext.SaveChangesAsync();

                return Ok("Продукт успішно видалено.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }
    }
}