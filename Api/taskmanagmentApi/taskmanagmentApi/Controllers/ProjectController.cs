using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Models;
using taskmanagmentApi.Services;

namespace taskmanagmentApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IGetDataService _getDataService;
        public ProjectController(IProjectService projectService, IGetDataService getDataService)
        {
            _projectService = projectService;
            _getDataService = getDataService;
        }

      
        [HttpGet("getproject")]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _getDataService.GetAllAsync<Project>();
            return Ok(projects);
        }

        [HttpGet("getmodule/{projectId}")]
        public async Task<IActionResult> GetModule(int projectId)
        {
            var modules = await _projectService.GetModulesByProjectIdAsync(projectId);
            return Ok(modules);
        }


        [HttpPost("insertproject")]
        public async Task<ActionResult<ProjectResponseDto>> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var createdProject = await _projectService.CreateProjectAsync(createProjectDto);
                return Ok(new { message = "Project Created successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the project", error = ex.Message });
            }
        }

        [HttpPost("insertmodule")]
        public async Task<ActionResult<CreateModuleDto>> createmodule([FromBody] CreateModuleDto createModuleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var createdProject = await _projectService.CreateModuleAsync(createModuleDto);
                return Ok(new { message = "Module Created successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the project", error = ex.Message });
            }
        }

        [HttpPost("assign-users")]
        public async Task<IActionResult> AssignUsers([FromBody] ProjectAssignUserDto dto)
        {
            await _projectService.AssignUsersToProjectAsync(dto);
            return Ok(new { message = "Users assigned successfully!" });
        }
    }
} 