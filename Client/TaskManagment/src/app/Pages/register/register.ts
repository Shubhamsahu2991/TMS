import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService, RegisterDto } from '../../Core/Service/auth-service';
import { CommonModule } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  roles: { value: string, label: string }[] = [];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      employeeId: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }
  ngOnInit() {
    this.authService.getAllRoles().subscribe((res) => {
       this.roles = res.map(r => ({
        value: r,
        label: r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()  
       
      })
      
    );  this.cdRef.detectChanges();
    });
    
  }

  register() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    const registerData: RegisterDto = {
      fullName: this.registerForm.value.fullName,
      employeeId:this.registerForm.value.employeeId, // Assuming employeeId is not required for registration
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };
    this.authService.register(registerData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        this.handleError(error);
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response) => {
      if (response) {
        this.handleSuccess(response);
      }
    });
  }


  handleSuccess(response: any) {
    console.log('Registration successful:', response);
    
    // Handle text response from API
    let successMsg = 'Registration successful! Redirecting to login...';
    
    if (typeof response === 'string') {
      successMsg = response; // Use the text response from API
    } else if (response && response.message) {
      successMsg = response.message;
    }
    
    this.successMessage = successMsg;
    
    // Clear any previous error messages
    this.errorMessage = '';
    
    // Reset form
    this.registerForm.reset();
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  handleError(error: any) {
    console.error('Registration error details:', error);
    
    let errorMsg = 'Registration failed. Please try again.';
    
    if (error.error) {
      // Handle different types of error responses
      if (typeof error.error === 'string') {
        errorMsg = error.error;
      } else if (error.error.message) {
        errorMsg = error.error.message;
      } else if (error.error.errors) {
        // Handle validation errors from API
        const validationErrors = error.error.errors;
        const errorMessages = Object.values(validationErrors).flat();
        errorMsg = Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages;
      } else if (error.error.text) {
        // Handle text error responses
        errorMsg = error.error.text;
      }
    } else if (error.message) {
      errorMsg = error.message;
    } else if (error.status === 409) {
      errorMsg = 'User with this email already exists.';
    } else if (error.status === 400) {
      errorMsg = 'Invalid registration data. Please check your information.';
    } else if (error.status === 500) {
      errorMsg = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      errorMsg = 'Network error. Please check your connection.';
    }
    
    this.errorMessage = errorMsg;
    this.successMessage = '';
  }

  markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${requiredLength} characters`;
    }
    
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  // Clear error message when user starts typing
  clearError() {
    this.errorMessage = '';
  }

  // Clear success message when user starts typing
  clearSuccess() {
    this.successMessage = '';
  }
} 