namespace Backend.Models
{
    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class RegisterDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class PasswordResetDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
    }
}
