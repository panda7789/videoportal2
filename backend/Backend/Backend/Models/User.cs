using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class User: IdentityUser
    {
        public string Initials { get; set; }
        public Privileges Rights { get; set; }

    }

    public enum Privileges
    {
        user,
        videoEditor,
        admin
    }

}
