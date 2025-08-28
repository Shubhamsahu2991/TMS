namespace taskmanagmentApi.DTOs
{
    public class AuthResultDto
    {
        public string Token { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
    public class UserDto
    {
        public string FullName { get; set; }
        public string Username { get; set; }
        public int LocalId { get; set; }
        public string Role { get; set; }

    }
    public class LoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
    public class RegisterDto
    {
        public string FullName { get; set; }

        public string EmployeeId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

    }
}
