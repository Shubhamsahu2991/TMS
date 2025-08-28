// task-create.dto.ts
export interface TaskCreateDto {
  projectId: number;
  moduleId: number | null;
  title: string;
  description: string;
  assignedBy: number;
  assignedTo: number;
  statusId: number;
  priorityId: number;
  assignedDate: string;
  dueDate: string;
}


export interface TaskResponseDto extends TaskCreateDto {
  taskId: number;
  createdAt: string;
}
