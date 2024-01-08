namespace Backend.Models
{
    public class Permission
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public virtual User? User { get; set; }
        public Guid? UserGroupId { get; set; }
        public virtual UserGroup? UserGroup { get; set; }
        public Guid? PlaylistId { get; set; }
        public virtual Playlist? Playlist { get; set; }
        public Guid? VideoId { get; set; }
        public virtual Video? Video { get; set; }

    }
}
