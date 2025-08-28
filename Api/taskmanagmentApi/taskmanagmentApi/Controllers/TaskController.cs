using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Models;
using taskmanagmentApi.Services;

namespace taskmanagmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly IGetDataService _getDataService;
        private readonly ITaskService _taskService;

        public TaskController(IGetDataService getDataService, ITaskService taskService)
        {
            _getDataService = getDataService;
            _taskService = taskService;
        }

        [HttpGet("priorities")]
        public async Task<IActionResult> GetPriorities()
        {
            var priorities = await _getDataService.GetAllAsync<Priority>();
            return Ok(priorities);
        }

        [HttpGet("Status")]
        public async Task<IActionResult> GetStatus()
        {
            var status = await _getDataService.GetAllAsync<Status>();
            return Ok(status);
        }

        [HttpGet("GetUserIdsByModule/{moduleId}")]
        public async Task<IActionResult> GetUserIdsByModule(int moduleId)
        {
            var userIds = await _taskService.GetUserIdsByModuleAsync(moduleId);
            return Ok(userIds);
        }




        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] TaskCreateDto dto)
        {
            var createdTask = await _taskService.CreateTaskAsync(dto);
            return Ok(createdTask);
        }

        [HttpGet("GetAlltask")]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("GettaskIdsByModule/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPut("updatetaskbyId/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskCreateDto dto)
        {
            var updated = await _taskService.UpdateTaskAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("DeletetaskbyId/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _taskService.DeleteTaskAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }

} 
 

