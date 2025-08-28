import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department, DepartmentDto, DepartmentHierarchyDto } from '../../interface/team.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  
   private apiUrl = 'http://localhost:5198/api/Department'; // 🔹 change base URL

  constructor(private http: HttpClient) {}

  insertDepartment(department: DepartmentDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/insertDepartment`, department);
  }
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getDepartment`);
  }
 
  assignRoles(dto: DepartmentHierarchyDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, dto);
  }

   getDepartmentHierarchy(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hierarchy`);
  }
  

  
}
