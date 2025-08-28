using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Models;
using taskmanagmentApi.Services;

namespace taskmanagmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UserController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("getAllUser")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _authService.GetAllUsersWithRoleAsync();
            return Ok(users);
        }
    }
}
