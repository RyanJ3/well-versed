// src/app/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../auth.service';
import {NonNullAssert} from '@angular/compiler';
import {ErrorHandlerService} from '../handlers/error-handler.service';

// Password match validator function - moved outside the component
export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl) => {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    formGroup.get('confirmPassword')?.setErrors({ matching: true });
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="register-container">
      <div class="card">
        <h2 class="card-header">Register</h2>
        <div class="card-body">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                formControlName="name"
                class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['name'].errors }"
              />
              <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                <div *ngIf="f['name'].errors?.['required']">Name is required</div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                formControlName="email"
                class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['email'].errors }"
              />
              <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                <div *ngIf="f['email'].errors?.['required']">Email is required</div>
                <div *ngIf="f['email'].errors?.['email']">Enter a valid email address</div>
              </div>
            </div>

            <div class="form-group">
              <label for="denomination">Denomination</label>
              <select
                formControlName="denomination"
                class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['denomination'].errors }"
              >
                <option value="">Select a denomination</option>
                <option value="Baptist">Baptist</option>
                <option value="Catholic">Catholic</option>
                <option value="Lutheran">Lutheran</option>
                <option value="Methodist">Methodist</option>
                <option value="Presbyterian">Presbyterian</option>
                <option value="Anglican/Episcopal">Anglican/Episcopal</option>
                <option value="Pentecostal">Pentecostal</option>
                <option value="Evangelical">Evangelical</option>
                <option value="Orthodox">Orthodox</option>
                <option value="Non-Denominational">Non-Denominational</option>
                <option value="Other">Other</option>
              </select>
              <div *ngIf="submitted && f['denomination'].errors" class="invalid-feedback">
                <div *ngIf="f['denomination'].errors?.['required']">Denomination is required</div>
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                formControlName="password"
                class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
              />
              <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                <div *ngIf="f['password'].errors?.['required']">Password is required</div>
                <div *ngIf="f['password'].errors?.['minlength']">Password must be at least 6 characters</div>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                formControlName="confirmPassword"
                class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['confirmPassword'].errors }"
              />
              <div *ngIf="submitted && f['confirmPassword'].errors" class="invalid-feedback">
                <div *ngIf="f['confirmPassword'].errors?.['required']">Please confirm your password</div>
                <div *ngIf="f['confirmPassword'].errors?.['matching']">Passwords must match</div>
              </div>
            </div>

            <div class="form-group">
              <button [disabled]="loading" class="btn btn-primary">
                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
                Register
              </button>
              <a routerLink="/login" class="btn btn-link">Cancel</a>
            </div>

            <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background-color: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      font-weight: 600;
    }

    .card-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }

    .is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      border: none;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0069d9;
    }

    .btn-link {
      color: #007bff;
      text-decoration: none;
      background: none;
      border: none;
      padding: 8px 16px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #f5c6cb;
    }

    .spinner-border {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 0.2em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border .75s linear infinite;
    }

    @keyframes spinner-border {
      to {
        transform: rotate(360deg);
      }
    }

    .mr-1 {
      margin-right: 0.25rem;
    }

    .mt-3 {
      margin-top: 1rem;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      denomination: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = ''; // Clear previous errors

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(
      this.f['email'].value,
      this.f['password'].value,
      this.f['name'].value,
      this.f['denomination'].value
    )
      .then((success: any) => {
        if (success) {
          this.router.navigate(['/login'], {queryParams: {registered: true}});
        } else {
          // Using error handler for failed registration
          this.errorHandler.showErrorModal({
            title: 'Registration Failed',
            message: 'We couldn\'t create your account. Please try again.',
            showRetry: true,
            retryCallback: () => this.retryRegistration()
          });

          this.error = 'Registration failed. Please try again.';
          this.loading = false;
        }
      })
      .catch((err: any) => {
        // Handle specific errors
        if (err.code && err.code.startsWith('auth/')) {
          this.handleAuthError(err);
        } else {
          // General error handling
          this.errorHandler.showErrorModal({
            title: 'Registration Error',
            message: 'An error occurred during registration.',
            details: err.message || 'Unknown error',
            showRetry: true,
            retryCallback: () => this.retryRegistration()
          });
        }

        this.error = err.message || 'An unexpected error occurred';
        this.loading = false;
      });
  }

  // Helper method to handle auth-specific errors
  private handleAuthError(error: any): void {
    let message = 'Registration failed.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email address is already in use.';
        break;
      case 'auth/invalid-email':
        message = 'The email address format is invalid.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak. Please use at least 6 characters.';
        break;
      default:
        message = error.message || 'An unexpected authentication error occurred.';
    }

    this.error = message;

    this.errorHandler.showErrorModal({
      title: 'Registration Error',
      message: message,
      showRetry: true,
      retryCallback: () => this.retryRegistration()
    });
  }

  // Retry registration after error
  retryRegistration(): void {
    if (this.registerForm.valid) {
      this.onSubmit();
    }
  }

}
