namespace taskmanagmentApi.DTOs
{
    public class TaskCreateDto
    {
        public int ProjectId { get; set; }
        public int? ModuleId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public int AssignedBy { get; set; }
        public int AssignedTo { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class TaskResponseDto
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public int? ModuleId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public int AssignedBy { get; set; }
        public int AssignedTo { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class Usermangerdto
    {
        public int Userid { get; set; }
        public int Managerid { get; set; }

    }



}
