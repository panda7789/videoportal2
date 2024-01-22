using Microsoft.AspNetCore.Authorization;
using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public static class RoleNames
    {
        public const string User = "USER";
        public const string Admin = "ADMIN";
        public const string Editor = "EDITOR";
    }
    public class RolesAttribute : AuthorizeAttribute
    {
        public RolesAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }

    public class Role : IdentityRole<Guid> 
    {
        public Role() : base()
        {
        }

        public Role(string roleName) : base(roleName)
        {
        }
    }

    public class User: IdentityUser<Guid>
    {
        public string Name { get; set; }
        public string Initials { get; set; }
        public UserRoles Roles { get; set; }
        public virtual ICollection<UserGroup> UserGroups { get; set; }
        public Guid? WatchLaterPlaylistId { get; set; }
        public virtual Playlist? WatchLaterPlaylist { get; set; }

        public UserDTO ToDTO() => new UserDTO
        {
            Email = Email,
            Id = Id,
            Name = Name,
            Initials = Initials,
            Roles = Roles
        };
    }

    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Initials { get; set; }
        public UserRoles Roles { get; set; }
    }

    [Owned]
    public class UserRoles
    {
        public bool User { get; set; }
        public bool VideoEditor { get; set; }
        public bool Administrator { get; set; }

        public IEnumerable<string> GetActiveRoles()
        {
            var list = new List<string>();
            if (User)
            {
                list.Add(RoleNames.User);
            }
            if (VideoEditor)
            {
                list.Add(RoleNames.Editor);
            }
            if (Administrator)
            {
                list.Add(RoleNames.Admin);
            }
            return list;
        }
        public IEnumerable<string> GetDisabledRoles()
        {
            var list = new List<string>();
            if (!User)
            {
                list.Add(RoleNames.User);
            }
            if (!VideoEditor)
            {
                list.Add(RoleNames.Editor);
            }
            if (!Administrator)
            {
                list.Add(RoleNames.Admin);
            }
            return list;
        }
    }

}
