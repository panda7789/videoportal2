﻿using Backend.Controllers;
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
        private readonly RoleManager<Role> _roleManager;

        private readonly IConfiguration _configuration;
        public AuthenticationService(UserManager<User> userManager, RoleManager<Role> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task<string> Register(RegisterDTO request)
        {
            var newUserRoles = new UserRoles() { User = true };

            User user = new()
            {
                UserName = request.Email,
                Name = request.Name,
                Email = request.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                Initials = (request.Name.IndexOf(" ") is int spaceIndex) && spaceIndex > 0 ? $"{request.Name[0]}{request.Name[spaceIndex + 1]}" : request.Name[..2],
                Roles = newUserRoles
            };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                throw new Exception($"Nepovedlo se registrovat uživatele {request.Email} chyba: {GetErrorsText(result.Errors)}");
            }

            result = await UsersController.UpdateUserRoles(_userManager, user, null, newUserRoles);
            if (!result.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                throw new Exception($"Nepovedlo se registrovat uživatele {request.Email} chyba: {GetErrorsText(result.Errors)}");
            }

            PlaylistsController.CreateWatchLaterPlaylist(user);
            result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Nepovedlo se registrovat uživatele {request.Email}, playlist přehrát pozděni se nepovedlo vytvořit chyba: {GetErrorsText(result.Errors)}");
            }

            return await Login(new LoginDTO { Email = request.Email, Password = request.Password });
        }

        public async Task<string> Login(LoginDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                throw new Exception($"Uživatele se nepovedlo ověřit {request.Email}");
            }
            var authClaims = new List<Claim>
            {
                new(ClaimTypes.Email, user.Email),
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var roleName in roles)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role.NormalizedName));
                }
            }

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
