using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Helper;
using taskmanagmentApi.Models;

namespace taskmanagmentApi.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto model);
        Task<AuthResultDto> LoginAsync(LoginDto model);
        Task<List<UserDto>> GetAllUsersWithRoleAsync();
    }
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<ApplicationUser> userManager,
                           RoleManager<ApplicationRole> roleManager,
                           IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }

        public async Task<string> RegisterAsync(RegisterDto model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return "User already exists.";

            var maxLocalId = await _userManager.Users.MaxAsync(u => (int?)u.LocalId) ?? 0;

            var user = new ApplicationUser
            {
                UserName = model.EmployeeId,
                Email = model.Email,
                FullName = model.FullName,
                LocalId = maxLocalId + 1 // ✅ Auto-increment LocalId
            };


            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return "User creation failed.";

            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new ApplicationRole { Name = model.Role });

            await _userManager.AddToRoleAsync(user, model.Role);
            return "User created successfully.";
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return null;

            var roles = await _userManager.GetRolesAsync(user);
            var token = JwtHelper.GenerateJwtToken(user, roles, _config);

            return new AuthResultDto
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = roles.FirstOrDefault()
            };
        }

        public async Task<List<UserDto>> GetAllUsersWithRoleAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userList = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault(); // only one role per user

                userList.Add(new UserDto
                {
                    Username = user.UserName,
                    FullName = user.FullName,
                    LocalId = user.LocalId,
                    Role = role
                });
            }

            return userList;
        }

    }
}
