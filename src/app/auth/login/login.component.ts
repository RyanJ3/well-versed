// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../register/auth.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    template: `
        <div class="login-container">
            <div class="card">
                <h2 class="card-header">Login</h2>
                <div class="card-body">
                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                            <label for="password">Password</label>
                            <input
                                    type="password"
                                    formControlName="password"
                                    class="form-control"
                                    [ngClass]="{ 'is-invalid': submitted && f['password'].errors }"
                            />
                            <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                                <div *ngIf="f['password'].errors['required']">Password is required</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <button [disabled]="loading" class="btn btn-primary">
                                <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
                                Login
                            </button>
                            <a routerLink="/register" class="btn btn-link">Register</a>
                        </div>
                        <div *ngIf="error" class="alert alert-danger mt-3">{{ error }}</div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles: [`
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }

    .card {
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
      to { transform: rotate(360deg); }
    }

    .mr-1 {
      margin-right: 0.25rem;
    }

    .mt-3 {
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        // Get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnInit(): void {
        // Redirect if already logged in
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/profile']);
        }
    }

    // Convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit(): void {
        this.submitted = true;

        // Stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.login(this.f['email'].value, this.f['password'].value)
            .then((success:any) => {
                if (success) {
                    this.router.navigate([this.returnUrl]);
                } else {
                    this.error = 'Login failed. Please check your credentials.';
                    this.loading = false;
                }
            })
            .catch((err: any) => {
                // Handle specific errors from your auth service
                this.error = err.message || 'An unexpected error occurred';
                this.loading = false;
            });
    }
}
