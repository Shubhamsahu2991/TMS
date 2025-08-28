using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.Models;

namespace taskmanagmentApi.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Priority> Priorities { get; set; }

        public DbSet<Status> Status { get; set; }
        public DbSet<TaskModel> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }
       public DbSet<ProjectAssignUserID> ProjectAssignUserIDs{ get; set; }
        public DbSet<ApplicationRole> ApplicationRoles { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<UserManagerMapping> UserManagerMappings { get; set; }



    }
}
