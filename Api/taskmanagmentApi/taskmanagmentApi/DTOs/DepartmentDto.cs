namespace taskmanagmentApi.DTOs
{
    public class CreateDepartmentDto
    {
        public string? Name { get; set; }

        public int SegmentHeadId { get; set; }

    }
    public class DepartmentResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }
    public class UserManagerMappingDto
    {
        public int DepartmentId { get; set; }
        public int? ManagerUserId { get; set; }
        public List<int> UserIds { get; set; } = new(); // plural ✅
    }

    public class UserManagerMappingResponseDto
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public int? ParentEmployeeId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class DepartmentHierarchyDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        public int SegmentHeadLocalId { get; set; }
        public string SegmentHeadName { get; set; }
        public string SegmentHeadRole { get; set; }

        public int ManagerLocalId { get; set; }
        public string ManagerName { get; set; }
        public string ManagerRole { get; set; }

        public int UserLocalId { get; set; }
        public string UserName { get; set; }
        public string UserRole { get; set; }

        public DateTime CreatedAt { get; set; }
    }


    //new code

    public class DepartmentHierarchyResponse
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        public SegmentHeadDto SegmentHead { get; set; }
    }

    public class SegmentHeadDto
    {
        public int LocalId { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }

        public List<ManagerDto> Managers { get; set; } = new();
    }

    public class ManagerDto
    {
        public int LocalId { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }

        public List<UsersDto> Users { get; set; } = new();
    }

    public class UsersDto
    {
        public int LocalId { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }











}
