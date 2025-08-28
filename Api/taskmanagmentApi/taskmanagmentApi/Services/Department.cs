using Microsoft.EntityFrameworkCore;
using System.Data;
using taskmanagmentApi.Data;
using taskmanagmentApi.DTOs;
using taskmanagmentApi.Interface;
using taskmanagmentApi.Interfaces;
using taskmanagmentApi.Models;
using Dapper;
 

namespace taskmanagmentApi.Services
{
    public interface IDepartmentService
    {
        Task<DepartmentResponseDto> CreateDepartmentAsync(CreateDepartmentDto createDepartmentDto);

        Task<IEnumerable<UserManagerMappingResponseDto>> AssignRolesAsync(UserManagerMappingDto dto);
        Task<IEnumerable<DepartmentHierarchyDto>> GetDepartmentHierarchyAsync();
    }

    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext _context;
        private readonly IinsertDataService _insertDataService;



        public DepartmentService(AppDbContext context, IinsertDataService insertDataService, IGetDataService getDataService)
        {
            _context = context;
            _insertDataService = insertDataService;
        }

        public async Task<DepartmentResponseDto> CreateDepartmentAsync(CreateDepartmentDto createDepartmentDto)
        {
            var Department = new Department
            {
                Name = createDepartmentDto.Name,
                SegmentHeadId =createDepartmentDto.SegmentHeadId,
            };

            var createdDepartment = await _insertDataService.InsertAsync(Department);

            return new DepartmentResponseDto
            {

                Id = createdDepartment.Id,
                Name = createdDepartment.Name
            };
        }

        public async Task<IEnumerable<UserManagerMappingResponseDto>> AssignRolesAsync(UserManagerMappingDto dto)
        {
            var assignments = new List<UserManagerMapping>();

            foreach (var empId in dto.UserIds) // ✅ loop through list of employee IDs
            {
                var assign = new UserManagerMapping
                {
                    DepartmentId = dto.DepartmentId,
                    ManagerUserId = dto.ManagerUserId,
                    UserId = empId
                };

                assignments.Add(assign);
            }

            _context.UserManagerMappings.AddRange(assignments);
            await _context.SaveChangesAsync();

            // Convert to response DTO
            return assignments.Select(x => new UserManagerMappingResponseDto
            {
                Id = x.Id,
                DepartmentId = x.DepartmentId,
                ParentEmployeeId = x.ManagerUserId,
                EmployeeId = x.UserId,
                CreatedAt = x.CreatedAt
            }).ToList();
        }


        public async Task<IEnumerable<DepartmentHierarchyDto>> GetDepartmentHierarchyAsync()
        {
            using (var connection = _context.Database.GetDbConnection())
            {
                if (connection.State == ConnectionState.Closed)
                    await connection.OpenAsync();

                var result = await connection.QueryAsync<DepartmentHierarchyDto>(
                    "sp_GetDepartmentHierarchy",   // ✅ Your procedure name
                    commandType: CommandType.StoredProcedure
                );

                return result.ToList();
            }
        }

        //public async Task<IEnumerable<DepartmentHierarchyResponse>> GetDepartmentHierarchyAsync()
        //{
        //    using (var connection = _context.Database.GetDbConnection())
        //    {
        //        if (connection.State == ConnectionState.Closed)
        //            await connection.OpenAsync();

        //        var result = await connection.QueryAsync<DepartmentHierarchyDto>(
        //            "sp_GetDepartmentHierarchy",
        //            commandType: CommandType.StoredProcedure
        //        );

        //        // Group into hierarchy
        //        var hierarchy = result
        //            .GroupBy(r => new { r.DepartmentId, r.DepartmentName, r.SegmentHeadLocalId, r.SegmentHeadName, r.SegmentHeadRole })
        //            .Select(depGroup => new DepartmentHierarchyResponse
        //            {
        //                DepartmentId = depGroup.Key.DepartmentId,
        //                DepartmentName = depGroup.Key.DepartmentName,
        //                SegmentHead = new SegmentHeadDto
        //                {
        //                    LocalId = depGroup.Key.SegmentHeadLocalId,
        //                    FullName = depGroup.Key.SegmentHeadName,
        //                    Role = depGroup.Key.SegmentHeadRole,
        //                    Managers = depGroup
        //                        .GroupBy(m => new { m.ManagerLocalId, m.ManagerName, m.ManagerRole })
        //                        .Select(mgrGroup => new ManagerDto
        //                        {
        //                            LocalId = mgrGroup.Key.ManagerLocalId,
        //                            FullName = mgrGroup.Key.ManagerName,
        //                            Role = mgrGroup.Key.ManagerRole,
        //                            Users = mgrGroup.Select(u => new UsersDto
        //                            {
        //                                LocalId = u.UserLocalId,
        //                                FullName = u.UserName,
        //                                Role = u.UserRole,
        //                                CreatedAt = u.CreatedAt
        //                            }).ToList()
        //                        }).ToList()
        //                }
        //            }).ToList();

        //        return hierarchy;
        //    }
        //}



    }
}
