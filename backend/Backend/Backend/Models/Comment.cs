using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace Backend.Models
{
    public class Comment
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid VideoId { get; set; }
        public string Text { get; set; }
        public DateTime Created { get; set; }
    }

    public class CommentDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set;}
        public Guid VideoId { get; set;}
        public string Text { get; set; }
        public DateTime Created { get; set; }
        public UserDTO User { get; set; }
    }

    public class CommentPutDTO
    {
        public string Text { get; set; }

    }

    public class CommentPostDTO
    {
        public Guid VideoId { get; set; }
        public string Text { get; set; }
    }
}
