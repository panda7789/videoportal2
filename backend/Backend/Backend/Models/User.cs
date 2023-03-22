namespace Backend.Models
{
    public class User
    {
        public Guid Id { get; set; }
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
