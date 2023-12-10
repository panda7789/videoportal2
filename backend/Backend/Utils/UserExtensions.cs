using Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Utils
{
    public static class UserExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
            {
                return null;
            }
            return new Guid(userId);
        }
        
        public static User GetUser(this ClaimsPrincipal user, MyDbContext _context)
        {
            return _context.Users.Find(user.GetUserId());
        }
    }
}
