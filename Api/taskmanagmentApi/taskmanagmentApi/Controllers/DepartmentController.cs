using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Models;
using taskmanagmentApi.Services;

namespace taskmanagmentApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _DepartmentService;
        private readonly IGetDataService _getDataService;
        public DepartmentController(IDepartmentService DepartmentService, IGetDataService getDataService)
        {
            _DepartmentService = DepartmentService;
            _getDataService = getDataService;
        }

        [HttpPost("insertDepartment")]
        public async Task<ActionResult<DepartmentResponseDto>> createDepartment([FromBody] CreateDepartmentDto createDepartmentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var createdProject = await _DepartmentService.CreateDepartmentAsync(createDepartmentDto);
                return Ok(new { message = "Department Created successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the project", error = ex.Message });
            }
        }
        
        
        [HttpGet("getDepartment")]
        public async Task<IActionResult> GetDepartments()
        {
            var Departments = await _getDataService.GetAllAsync<Department>();
            return Ok(Departments);
        }

        /// <summary>
        /// Assign employees to a department and manager
        /// </summary>
        [HttpPost("assign")]
        public async Task<IActionResult> AssignUsers([FromBody] UserManagerMappingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _DepartmentService.AssignRolesAsync(dto);

            return Ok(new
            {
                success = true,
                message = "Users assigned successfully",
                data = result
            });
        }

        [HttpGet("hierarchy")]
        public async Task<IActionResult> GetHierarchy()
        {
            var data = await _DepartmentService.GetDepartmentHierarchyAsync();
            return Ok(data);
        }
    }
}
