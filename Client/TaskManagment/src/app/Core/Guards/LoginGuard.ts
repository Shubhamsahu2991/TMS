import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../Service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    debugger; // Debugging line to check guard activation
    return this.authService.checkAuthStatus().pipe(
      map(isAuthenticated => {
        debugger
        if (isAuthenticated) {
          this.router.navigate(['/Dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
