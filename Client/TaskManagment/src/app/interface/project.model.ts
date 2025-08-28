export interface Project {
  projectId: number;
  projectName: string;
  isActive: string;
  description?: string;
  createdDate?: Date;
  
}
export interface Module {
  ModuleId: number;
  ModuleName: string;
  projectId: number;
  Description?: string;
  CreatedDate?: Date;
  IsActive: string;

}
 
export interface CreateProjectDto {
  projectName: string;
  isActive: string;
  description?: string;
}

export interface ProjectResponseDto {
  projectId: number;
  projectName: string;
  isActive: string;
  description?: string;
  createdDate: Date;
} 

export interface AssignProjectRequest{
  projectID: number;
  userIDs: number[]; // Assuming user IDs are strings
}
export interface CreateModuleDto {
  moduleName: string;
  projectId: number;
  description?: string;
}

export interface getProjectdbyuseridto {
  projectid : number;
  projectname : string;
}

