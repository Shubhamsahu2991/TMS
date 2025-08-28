using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace taskmanagmentApi.Models
{
    public class Module
    {
        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModuleId { get; set; }

        public int ProjecteId { get; set; }

        [Required]

        [StringLength(255)]
        public string? ModuleName { get; set; }

        public string? IsActive { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string? Description { get; set; }
    }

}
 
