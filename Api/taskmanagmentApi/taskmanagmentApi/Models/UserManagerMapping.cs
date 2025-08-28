namespace taskmanagmentApi.Models
{
    public class UserManagerMapping
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public int? ManagerUserId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
