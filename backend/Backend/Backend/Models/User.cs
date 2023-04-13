using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class Role : IdentityRole<Guid> { }

    public class User: IdentityUser<Guid>
    {
        public string Name { get; set; }
        public string Initials { get; set; }
        public UserRoles Roles { get; set; }

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
    }

}
