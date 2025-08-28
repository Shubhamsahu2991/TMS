using System.ComponentModel.DataAnnotations;

namespace taskmanagmentApi.DTOs
{
    public class CreateProjectDto
    {
        [Required]
        [StringLength(255)]
        public string ProjectName { get; set; }

        public string IsActive { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }
    }

    public class ProjectResponseDto
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateProjectDto
    {
        [Required]
        [StringLength(255)]
        public string ProjectName { get; set; }

        public string IsActive { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }
    }

    public class ProjectAssignUserDto
    {
        public int ProjectID { get; set; }
        public int ModuleId { get; set; }
        public List<int> UserIDs { get; set; }
    }

    public class CreateModuleDto
    {
        public int projectId { get; set; }
        public string? ModuleName { get; set; }
        public string? description { get; set; }

    }



}