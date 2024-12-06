using course_work_backend.Model;
using course_work_backend.Services;
using course_work_backend.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace course_work_backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegistrationViewModel userRegModel)
        {
            try
            {
                var userModel = new UserModel
                {
                    Login = userRegModel.Login,
                    Email = userRegModel.Email,
                    HashPassword = userRegModel.Password,
                };

                var user = _userService.RegisterUser(userModel);
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.Role, UserRole.user.ToString()),
                    new Claim("user_id", userModel.Id.ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                // Встановлюємо JWT як HttpOnly cookie
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true, // Кука недоступна через JavaScript
                    Secure = true,   // Використовувати тільки по HTTPS (включити в продакшені)
                    SameSite = SameSiteMode.Strict, // Захист від CSRF
                    Expires = DateTime.Now.AddHours(1) // Час життя куки
                };

                Response.Cookies.Append("jwt_token", tokenString, cookieOptions);

                return Ok(new { Id = user.Id, Login = user.Login, Email = user.Email, IsAdmin = user.IsAdmin });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("currentUser")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                // Витягуємо токен з cookies
                var tokenString = Request.Cookies["jwt_token"];

                if (string.IsNullOrEmpty(tokenString))
                {
                    return Unauthorized("Token not found.");
                }

                // Валідація токена та витягування claims
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

                    // Переконуємося, що це JWT токен
                    if (validatedToken is not JwtSecurityToken jwtToken ||
                        !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                    {
                        return Unauthorized("Invalid token.");
                    }
                }
                catch (Exception ex)
                {
                    return Unauthorized($"Token validation failed: {ex.Message}");
                }

                // Витягуємо user_id з claims
                var userIdClaim = principal.FindFirst("user_id");

                if (userIdClaim == null)
                {
                    return Unauthorized("User ID not found in token.");
                }

                var userId = int.Parse(userIdClaim.Value);

                // Отримуємо користувача з бази даних
                var user = _userService.GetUserByID(userId);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Повертаємо інформацію про користувача
                return Ok(new { Id = user.Id, Login = user.Login, Email = user.Email, IsAdmin = user.IsAdmin });
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Використовуйте true в продакшені
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddSeconds(-1) // Встановлюємо в минуле, щоб строк дії закінчився
            };

            Response.Cookies.Append("jwt_token", string.Empty, cookieOptions);

            return Ok(new { Message = "Logged out successfully." });
        }


        // Ендпоінт для входу (логін)
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserAuthenticationViewModel authModel)
        {
            try
            {

                var user = _userService.AuthenticateUser(authModel.Login, authModel.Password);

                if (user == null)
                    return Unauthorized();

                var claims = new[]
                    {
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? UserRole.admin.ToString() : UserRole.user.ToString()),
                    new Claim("user_id", user.Id.ToString()),
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                // Встановлюємо JWT як HttpOnly cookie
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true, // Кука недоступна через JavaScript
                    Secure = true,   // Використовувати тільки по HTTPS (включити в продакшені)
                    SameSite = SameSiteMode.Strict, // Захист від CSRF
                    Expires = DateTime.Now.AddHours(1) // Час життя куки
                };

                Response.Cookies.Append("jwt_token", tokenString, cookieOptions);

                return Ok(new { Id = user.Id, Login = user.Login, Email = user.Email, IsAdmin = user.IsAdmin });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
