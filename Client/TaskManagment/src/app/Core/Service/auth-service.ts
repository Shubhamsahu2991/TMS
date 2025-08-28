import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Router } from '@angular/router';
import { Roledto, UserDto } from '../../interface/user.model';

export interface RegisterDto {
  fullName: string;
  employeeId: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5198/api/Auth';
  private userUrl = 'http://localhost:5198/api/User';
  private userRole = new BehaviorSubject<string | null>(null);
  private userID = new BehaviorSubject<string | null>(null);
  private username = new BehaviorSubject<string | null>(null);
  role$ = this.userRole.asObservable();
  userID$ = this.userID.asObservable();
  username$ = this.username.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getAllUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.userUrl}/getAllUser`);
  }
 
  getAllRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Getroles`);
  }



  login(UserName: string, password: string) {
    return this.http.post<{ message: string; role: string }>(
      `${this.apiUrl}/login`,
      { UserName, password },
      { withCredentials: true } 
    );
  }

  register(registerData: RegisterDto) {
    return this.http.post(
      `${this.apiUrl}/register`,
      registerData,
      { 
        withCredentials: true,
        responseType: 'text' // Handle text response instead of JSON
      }
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.userRole.next(null);
      this.router.navigate(['/']);
    });
  }
  setUsername(username: string) {
    this.username.next(username);
  }
  getUsername(): Observable<string | null> {
    return this.username$;
  }
  
  setuserID(userID: string) {
    this.userID.next(userID);
  }

  getuserID(): Observable<string | null> {
    return this.userID$;
  }

  setRole(role: string) {
    this.userRole.next(role);
  }

  getRole(): Observable<string | null> {
    return this.role$;
  }

  getCurrentUser() {
    return this.http.get<{ username: string; role: string , localId: string; }>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }

 
  checkAuthStatus(): Observable<boolean> {
  return new Observable(observer => {
    debugger
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.setUsername(user.username);
        this.setRole(user.role);
        this.setuserID(user.localId);
        observer.next(true);
      },
      error: () => {
        observer.next(false);
      }
    });
  });
}


 
  
}
