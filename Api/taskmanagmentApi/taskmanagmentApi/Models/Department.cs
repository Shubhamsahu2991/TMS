using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace taskmanagmentApi.Models
{
    public class Department
    {
         
        public int Id { get; set; }
        public string Name { get; set; }

        public int SegmentHeadId { get; set; }

    }
}
