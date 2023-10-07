﻿namespace Backend.Models
{
    public class UserGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<User> Users { get; set; }
    }
}
