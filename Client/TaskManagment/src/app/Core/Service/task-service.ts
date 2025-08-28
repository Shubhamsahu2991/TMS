import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getProjectdbyuseridto } from '../../interface/project.model';
import { priorityDto, StatusDto } from '../../interface/user.model';
import { TaskCreateDto, TaskResponseDto } from '../../interface/task.model';
 
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5198/api/task'; // Update this URL to match your API

  constructor(private http: HttpClient) { }

  
  createTask(dto: TaskCreateDto): Observable<TaskResponseDto> {
    return this.http.post<TaskResponseDto>(`${this.apiUrl}/create`, dto);
  }

  getTasks(): Observable<TaskResponseDto[]> {
    return this.http.get<TaskResponseDto[]>(this.apiUrl);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }




  getProjectsbyuserid(Userid: number): Observable<getProjectdbyuseridto[]> {
    return this.http.get<getProjectdbyuseridto[]>(`${this.apiUrl}/getprojectbyuserid/${Userid}`, { withCredentials: true });
  }
  
   getUserIdsByModule(moduleId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/GetUserIdsByModule/${moduleId}`);
  }
  priorities(): Observable<priorityDto[]> {
    return this.http.get<priorityDto[]>(`${this.apiUrl}/priorities`);
  }

  Status(): Observable<StatusDto[]> {
    return this.http.get<StatusDto[]>(`${this.apiUrl}/Status`);
  }

  
  
}
