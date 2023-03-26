using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        public AuthenticationService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> Register(RegisterDTO request)
        {
            var userByEmail = await _userManager.FindByEmailAsync(request.Email);
            if (userByEmail is not null)
            {
                throw new ArgumentException($"User with email {request.Email} already exists.");
            }

            User user = new()
            {
                UserName = request.Email,
                Name = request.Name,
                Email = request.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Initials = (request.Name.IndexOf(" ") is int spaceIndex) && spaceIndex > 0 ? $"{request.Name[0]}{request.Name[spaceIndex + 1]}" : request.Name[..2],
                Rights = Privileges.user
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new ArgumentException($"Unable to register user {request.Email} errors: {GetErrorsText(result.Errors)}");
            }

            return await Login(new LoginDTO { Email = request.Email, Password = request.Password });
        }

        public async Task<string> Login(LoginDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new ArgumentException($"Unable to authenticate user {request.Email}");
            }

            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = GetToken(authClaims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private JwtSecurityToken GetToken(IEnumerable<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("secret123ASQWEWQEWQEASDQWEQEQJGWJVIEWIRJAFNEWAR"));
            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

            return token;
        }

        private string GetErrorsText(IEnumerable<IdentityError> errors)
        {
            return string.Join(", ", errors.Select(error => error.Description).ToArray());
        }
    }
}
