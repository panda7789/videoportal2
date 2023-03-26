﻿using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class User: IdentityUser
    {
        public string Name { get; set; }
        public string Initials { get; set; }
        public Privileges Rights { get; set; }

        public UserDTO ToDTO() => new UserDTO
        {
            Email = Email,
            Id = Id,
            Name = Name,
            Initials = Initials,
            Rights = Rights
        };
    }

    public class UserDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
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