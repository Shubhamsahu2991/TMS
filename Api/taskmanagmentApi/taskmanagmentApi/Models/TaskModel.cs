using System.ComponentModel.DataAnnotations;

namespace taskmanagmentApi.Models
{
    public class TaskModel
    {
        [Key]
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public int AssignedBy { get; set; }
        public int AssignedTo { get; set; }
        public DateTime Assigneddate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
