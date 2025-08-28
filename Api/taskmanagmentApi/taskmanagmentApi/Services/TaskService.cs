using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.Data;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Interfaces;
using taskmanagmentApi.Models;

namespace taskmanagmentApi.Services
{
    public interface ITaskService
    {
        Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto);
        Task<IEnumerable<TaskModel>> GetAllTasksAsync();
        Task<TaskResponseDto> GetTaskByIdAsync(int id);
        Task<TaskResponseDto> UpdateTaskAsync(int id, TaskCreateDto dto);
        Task<bool> DeleteTaskAsync(int id);
        Task<List<int>> GetUserIdsByModuleAsync(int moduleId);
        

    }
    public class TaskService : ITaskService
    {

        private readonly IGetDataService _IgetDataService;
        private readonly IinsertDataService _IinsertDataService;
        private readonly AppDbContext _context;
        public TaskService(AppDbContext context, IinsertDataService IinsertDataService, IGetDataService IgetDataService)
        {
            _context = context;
            _IinsertDataService = IinsertDataService;
            _IgetDataService = IgetDataService;
        }

        public async Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto)
        {
            var task = new TaskModel
            {
                ProjectId = dto.ProjectId,
                Title = dto.Title,
                Description = dto.Description,
                StatusId = dto.StatusId,
                PriorityId = dto.PriorityId,
                AssignedBy = dto.AssignedBy,
                AssignedTo = dto.AssignedTo,
                Assigneddate = dto.AssignedDate,
                DueDate = dto.DueDate
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToResponseDto(task);
        }

        public async Task<IEnumerable<TaskModel>> GetAllTasksAsync()
        {
 
           var tasks = await _IgetDataService.GetAllAsync<TaskModel>();
            return tasks;
        }

        public async Task<TaskResponseDto> GetTaskByIdAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            return task != null ? MapToResponseDto(task) : null;
        }

        public async Task<TaskResponseDto> UpdateTaskAsync(int id, TaskCreateDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return null;

            task.ProjectId = dto.ProjectId;
            task.Title = dto.Title;
            task.Description = dto.Description;
            task.StatusId = dto.StatusId;
            task.PriorityId = dto.PriorityId;
            task.AssignedBy = dto.AssignedBy;
            task.AssignedTo = dto.AssignedTo;
            task.Assigneddate = dto.AssignedDate;
            task.DueDate = dto.DueDate;

            await _context.SaveChangesAsync();

            return MapToResponseDto(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        private TaskResponseDto MapToResponseDto(TaskModel task)
        {
            return new TaskResponseDto
            {
                TaskId = task.TaskId,
                ProjectId = task.ProjectId,
                Title = task.Title,
                Description = task.Description,
                StatusId = task.StatusId,
                PriorityId = task.PriorityId,
                AssignedBy = task.AssignedBy,
                AssignedTo = task.AssignedTo,
                AssignedDate = task.Assigneddate,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt
            };
        }

        public async Task<List<int>> GetUserIdsByModuleAsync(int moduleId)
        {
            var userIds = await _context.ProjectAssignUserIDs
                .Where(t => t.ModuleId == moduleId)
                .Select(t => t.UserId)
                .ToListAsync();

            // Return an empty list if there are no users instead of null
            return userIds ?? new List<int>();
        }

    }
}
