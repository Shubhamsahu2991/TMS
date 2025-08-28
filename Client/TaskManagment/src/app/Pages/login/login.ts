import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../Core/Service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, CommonModule, RouterModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const { UserName, password } = this.loginForm.value;

    this.authService.login(UserName, password).subscribe({
      next: () => {
        debugger
        // Now fetch the current user securely using the HttpOnly cookie
        this.authService.getCurrentUser().subscribe({
          next: (user) => {
            
            this.authService.setRole(user.role);
            this.authService.setuserID(user.localId);
            this.authService.setUsername(user.username);

            if (user.role?.toLowerCase() === 'tpm') {
              this.router.navigate(['/Dashboard/Head']);
            } else {
              this.router.navigate(['/Dashboard/Home']);
            }

            console.log('Login successful:', user);
          },
          error: () => {
            this.errorMessage = 'Failed to fetch user info';
          }
        });
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
