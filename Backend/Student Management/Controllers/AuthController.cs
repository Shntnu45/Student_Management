using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Student_Management.Data;
using Student_Management.DTOs;
using Student_Management.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Student_Management.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _db;

        public AuthController(IConfiguration configuration, ApplicationDbContext db)
        {
            _configuration = configuration;
            _db = db;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (_db.AppUsers.Any(u => u.Username == dto.Username))
                return BadRequest(new { message = "Username already exists." });

            if (_db.AppUsers.Any(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email already registered." });

            var user = new AppUser
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.AppUsers.Add(user);
            _db.SaveChanges();

            return Ok(new { message = "Registration successful." });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _db.AppUsers.FirstOrDefault(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid username or password." });

            var token = GenerateToken(user.Username);
            return Ok(new { token });
        }

        private string GenerateToken(string username)
        {
            var secret = _configuration["Jwt:Key"]!;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
            };

            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(handler.CreateToken(tokenDescriptor));
        }
    }
}
