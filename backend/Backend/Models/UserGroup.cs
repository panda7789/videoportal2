using System.ComponentModel;

namespace Backend.Models
{
    public class UserGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<User> Users { get; set; }
        public Guid? OwnerGroupId { get; set; }

        public UserGroupDTO ToDTO()
        {
            return new UserGroupDTO
            {
                Id = Id,
                Name = Name,
                Users = Users?.Select(x => x.ToDTO())?.ToList() ?? null,
                OwnerGroupId = OwnerGroupId
            };
        }
    }

    public class UserGroupDTO
    {   
        public Guid Id { get; set; }
        public string Name { get; set; }
        [Description("Kolekce informací o uživatelích patřící do skupiny.")]
        public ICollection<UserDTO> Users { get; set; }
        [Description("Id vlastnické skupiny, tedy skupiny, která skupinu vytvořila a může ji také upravovat.")]
        public Guid? OwnerGroupId { get; set; }
    }

    public class UserGroupPostPutDTO
    {
        public string Name { get; set; }
        [Description("Kolekce ID uživatelů patřících do skupiny.")]
        public ICollection<Guid> UserIds { get; set; }
        [Description("Id vlastnické skupiny, tedy skupiny, která skupinu vytvořila a může ji také upravovat.")]
        public Guid? OwnerGroupId { get; set; }
    }
}
