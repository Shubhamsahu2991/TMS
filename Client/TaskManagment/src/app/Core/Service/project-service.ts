import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, CreateProjectDto, ProjectResponseDto, AssignProjectRequest, CreateModuleDto, Module, getProjectdbyuseridto } from '../../interface/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:5198/api/Project'; // Update this URL to match your API

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/getproject`, { withCredentials: true });
  }

  createProject(project: CreateProjectDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/insertproject`, project);
  }

  createModule(Module: CreateModuleDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/insertmodule`, Module);
  }

  assignUsersToProject(payload: AssignProjectRequest ): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-users`, payload);
  }
  
  getModulesByProjectId(projectId: number): Observable<{ value: number, label: string }[]> {
    return this.http.get<{ value: number, label: string }[]>(`${this.apiUrl}/getmodule/${projectId}`);
  }
 
}
