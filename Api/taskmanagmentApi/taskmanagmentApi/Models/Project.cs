using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace taskmanagmentApi.Models
{
    public class Project
    {
        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProjectId { get; set; }

        [Required]

        [StringLength(255)]
        public string? ProjectName { get; set; }

        public string? IsActive { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string? Description { get; set; }
    }

}