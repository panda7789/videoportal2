using Backend.Models;
using Microsoft.EntityFrameworkCore;
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

        public static User GetUser(this ClaimsPrincipal user, MyDbContext context) => context.Users.Include(x => x.UserGroups).FirstOrDefault(x => x.Id == user.GetUserId());
    }
}
