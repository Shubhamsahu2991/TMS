using taskmanagmentApi.Data;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interfaces;
using taskmanagmentApi.Models;
using Microsoft.EntityFrameworkCore;
using taskmanagmentApi.Interface;



namespace taskmanagmentApi.Services
{
    public interface IProjectService
    {
        Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto createProjectDto);
        Task<CreateModuleDto> CreateModuleAsync(CreateModuleDto createModuleDto);
        Task AssignUsersToProjectAsync(ProjectAssignUserDto dto);
        Task<List<DropdownDto>> GetModulesByProjectIdAsync(int projectId);
        
    }

    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
        private readonly IinsertDataService _insertDataService;
  

        public ProjectService(AppDbContext context, IinsertDataService insertDataService , IGetDataService getDataService)
        {
            _context = context;
            _insertDataService = insertDataService;
        }

        public async Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                ProjectName = createProjectDto.ProjectName,
                IsActive = createProjectDto.IsActive,
                Description = createProjectDto.Description,
                CreatedDate = DateTime.UtcNow
            };

            var createdProject = await _insertDataService.InsertAsync(project);

            return new ProjectResponseDto
            {
                ProjectId = createdProject.ProjectId,
                ProjectName = createdProject.ProjectName,
                IsActive = createdProject.IsActive,
                CreatedDate = createdProject.CreatedDate,
                Description = createdProject.Description
            };
        }

        public async Task<CreateModuleDto> CreateModuleAsync(CreateModuleDto createModuleDto)
        {
            var module = new Module
            {
                ProjecteId = createModuleDto.projectId,
                ModuleName = createModuleDto.ModuleName,
                Description = createModuleDto.description,
                IsActive =  "Y",
                CreatedDate = DateTime.UtcNow
            };

            var createmodule = await _insertDataService.InsertAsync(module);

            return new CreateModuleDto
            {
                projectId = createmodule.ProjecteId,
            };
        }

        public async Task AssignUsersToProjectAsync(ProjectAssignUserDto dto)
        {
            foreach (var userId in dto.UserIDs)
            {
                var assignment = new ProjectAssignUserID
                {
                    ProjectId = dto.ProjectID,
                    ModuleId = dto.ModuleId,
                    UserId = userId
                };

                await _insertDataService.InsertAsync(assignment);
            }
        }

        public async Task<List<DropdownDto>> GetModulesByProjectIdAsync(int projectId)
        {
            return await _context.Modules
                .Where(m => m.ProjecteId == projectId)
                .Select(m => new DropdownDto
                {
                    Value = m.ModuleId,
                    Label = m.ModuleName
                })
                .ToListAsync();
        }


    }
} 