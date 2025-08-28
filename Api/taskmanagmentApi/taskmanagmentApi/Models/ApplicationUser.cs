using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace taskmanagmentApi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string ?FullName { get; set; }
        public int LocalId { get; set; }


    }
}
