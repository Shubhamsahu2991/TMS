using Microsoft.AspNetCore.Mvc;
using taskmanagmentApi.Services;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace taskmanagmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IGetDataService _getDataService;

        public AuthController(IAuthService authService , IGetDataService getDataService)
        {
            _authService = authService;
            _getDataService = getDataService;
        }


        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var fullName = User.Claims.FirstOrDefault(c => c.Type == "full_name")?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var localId = User.Claims.FirstOrDefault(c => c.Type == "local_id")?.Value;

            return Ok(new
            {
                username = fullName,  
                role = role,
                localId = localId
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null)
                return Unauthorized("Invalid credentials");

            Response.Cookies.Append("jwt", result.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(2)
            }
            );

            return Ok(new
            {
                message = "Login successful",
                role = result.Role
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Remove the JWT cookie securely
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("Getroles")]
        public async Task<IActionResult> Getroles()
        {
            var role = await _getDataService.GetAllAsync<ApplicationRole>();

            var roles = role.Select(r => r.NormalizedName).ToList();

            return Ok(roles);
        }

        [HttpGet("GetUserWithroles")]
        public async Task<IActionResult> GetUserWithroles()
        {
            var role = await _getDataService.GetAllAsync<ApplicationRole>();

            var roles = role.Select(r => r.NormalizedName).ToList();

            return Ok(roles);
        }

    }
}
 
