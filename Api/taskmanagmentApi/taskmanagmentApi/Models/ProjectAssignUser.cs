using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace taskmanagmentApi.Models
{
    public class ProjectAssignUserID
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public int ModuleId { get; set; }
    }

}
