export interface DepartmentDto {
  name: string;
  SegmentHeadId: number | null; // Assuming SegmentHead is a user ID
}
 
export interface Department {
  id: number;
  name: string;
}

export interface DepartmentHierarchyDto {
  DepartmentId?: number| null;
  ManagerUserId?: number | null;
  UserIds: number[];
}

 