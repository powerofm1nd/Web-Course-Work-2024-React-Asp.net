using course_work_backend.AppDBContext;
using course_work_backend.Model;
using course_work_backend.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace course_work_backend.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDBContext _dbContext;

        public OrderController(ApplicationDBContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        [HttpPost("create")]
        public ActionResult Create([FromBody] List<OrderItemViewModel> orderItemsVM)
        {
            if (orderItemsVM == null || !orderItemsVM.Any())
            {
                return BadRequest("Дані замовлення відсутні або порожні.");
            }

            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];
                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Токен не знайдений.");
                }

                // Валідація токену та витягування claims
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

                    // Переконуємось, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Невірний токен.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Не вдалося перевірити токен: {ex.Message}");
                }

                // Витягуємо user_id з claims
                var userIdClaim = principal.FindFirst("user_id");
                if (userIdClaim == null)
                {
                    return Unauthorized("User ID не знайдений у токені.");
                }

                var tokenUserId = int.Parse(userIdClaim.Value);

                // Перевіряємо, що userId з токену співпадає з userId з замовлення
                var requestUserId = orderItemsVM.First().UserId;
                if (requestUserId != tokenUserId)
                {
                    return Forbid("Ви не маєте дозволу створювати замовлення для іншого користувача.");
                }

                // Створюємо замовлення
                var order = new OrderModel
                {
                    UserId = requestUserId,
                    OrderItems = orderItemsVM.Select(item => new OrderItemModel
                    {
                        ProductId = item.ProductId,
                        ProductCount = item.ProductCount
                    }).ToList()
                };

                _dbContext.Orders.Add(order);
                _dbContext.SaveChanges();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            var orders = await _dbContext.Orders
                                        .Where(o => o.UserId == userId)
                                        .Include(o => o.OrderItems)
                                        .ThenInclude(oi => oi.Product)
                                        .OrderByDescending(o => o.Id)
                                        .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound(new { message = "Для заданого користувача не знайдено замовлень." });
            }

            return Ok(orders);
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];
                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Токен не знайдений.");
                }

                // Валідація токену та витягування claims
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

                    // Переконуємось, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Невірний токен.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Не вдалося перевірити токен: {ex.Message}");
                }

                // Перевіряємо роль користувача
                var roleClaim = principal.FindFirst(ClaimTypes.Role);
                if (roleClaim == null || roleClaim.Value != UserRole.admin.ToString())
                {
                    return Forbid("У вас немає доступу до цього ресурсу.");
                }

                // Отримуємо список замовлень
                var orders = await _dbContext.Orders
                                             .Include(o => o.OrderItems)
                                             .ThenInclude(oi => oi.Product)
                                             .Include(o => o.User)
                                             .OrderByDescending(o => o.Id)
                                             .ToListAsync();

                if (orders == null || orders.Count == 0)
                {
                    return NotFound(new { message = "Замовлення не знайдено." });
                }

                // Формуємо результат
                var result = orders.Select(order => new
                {
                    order.Id,
                    User = new
                    {
                        order.User.Id,
                        order.User.Login
                    },
                    OrderItems = order.OrderItems.Select(oi => new
                    {
                        oi.Id,
                        Product = new
                        {
                            oi.Product.Id,
                            oi.Product.Name,
                            oi.Product.Price
                        },
                        oi.ProductCount
                    }),
                    Status = order.Status
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }



        [HttpPost("updateStatus")]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateOrderStatusVM request)
        {
            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];
                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Токен не знайдений.");
                }

                // Валідація токену та витягування claims
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

                    // Переконуємось, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Невірний токен.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Не вдалося перевірити токен: {ex.Message}");
                }

                // Перевіряємо роль користувача
                var roleClaim = principal.FindFirst(ClaimTypes.Role);
                if (roleClaim == null || roleClaim.Value != UserRole.admin.ToString())
                {
                    return Forbid("У вас немає дозволу на зміну статусу замовлення.");
                }

                // Знайти замовлення по ID
                var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.OrderId);

                if (order == null)
                {
                    return NotFound(new { message = "Замовлення не знайдено." });
                }

                // Оновити статус замовлення
                order.Status = request.NewStatus;

                _dbContext.Orders.Update(order);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Статус замовлення оновлено." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Внутрішня помилка сервера: {ex.Message}");
            }
        }
    }
}
