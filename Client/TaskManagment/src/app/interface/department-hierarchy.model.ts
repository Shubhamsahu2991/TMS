// department-hierarchy.model.ts

export interface DepartmentHierarchy {
  departmentId: number;
  departmentName: string;
  segmentHeadLocalId: number;
  segmentHeadName: string;
  segmentHeadRole: string;
  managerLocalId: number;
  managerName: string;
  managerRole: string;
  userLocalId: number;
  userName: string;
  userRole: string;
  createdAt: string;
} 
