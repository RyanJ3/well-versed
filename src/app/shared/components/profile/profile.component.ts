// src/app/components/profile/profile.component.ts
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Activity, UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService, User} from '../../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="profile-container">
      <div class="row">
        <!-- User Profile Information -->
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h2>My Profile</h2>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
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
                    readonly
                  />
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

                <div class="form-group mt-4">
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                  <button type="button" class="btn btn-outline-danger ml-2" (click)="logout()">
                    Logout
                  </button>
                </div>

                <div *ngIf="updateMessage" class="alert mt-3"
                     [ngClass]="updateSuccess ? 'alert-success' : 'alert-danger'">
                  {{ updateMessage }}
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h2>Recent Activity</h2>
            </div>
            <div class="card-body activity-list">
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">Loading activity...</p>
              </div>

              <div *ngIf="!loading && activities.length === 0" class="text-center py-4">
                <p class="text-muted">No recent activity</p>
              </div>

              <div *ngFor="let activity of activities" class="activity-item">
                <div class="activity-icon">
                  <i class="fas" [ngClass]="activity.iconClass || 'fa-clock'"></i>
                </div>
                <div class="activity-content">
                  <h5 class="activity-title">{{ activity.title }}</h5>
                  <p class="activity-description">{{ activity.description }}</p>
                  <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      margin: -10px;
    }

    .col-md-8 {
      flex: 0 0 66.666667%;
      max-width: 66.666667%;
      padding: 10px;
    }

    .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
      padding: 10px;
    }

    @media (max-width: 768px) {
      .col-md-8, .col-md-4 {
        flex: 0 0 100%;
        max-width: 100%;
      }
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
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.25rem;
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

    .form-control:read-only {
      background-color: #f8f9fa;
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

    .btn-outline-danger {
      color: #dc3545;
      border: 1px solid #dc3545;
      background: none;
    }

    .btn-outline-danger:hover {
      background-color: #dc3545;
      color: white;
    }

    .ml-2 {
      margin-left: 0.5rem;
    }

    .mt-3 {
      margin-top: 1rem;
    }

    .mt-4 {
      margin-top: 1.5rem;
    }

    .alert {
      padding: 10px 15px;
      border-radius: 4px;
      margin-top: 15px;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .activity-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .activity-item {
      padding: 15px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: flex-start;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background-color: #f1f5f9;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;
      color: #007bff;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 5px 0;
    }

    .activity-description {
      font-size: 14px;
      color: #666;
      margin: 0 0 5px 0;
    }

    .activity-time {
      font-size: 12px;
      color: #999;
    }

    .text-center {
      text-align: center;
    }

    .text-muted {
      color: #6c757d;
    }

    .py-4 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    .spinner-border {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 0.25em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border .75s linear infinite;
    }

    .text-primary {
      color: #007bff;
    }

    @keyframes spinner-border {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  activities: Activity[] = [];
  submitted = false;
  loading = true;
  updateMessage = '';
  updateSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      denomination: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  ngOnInit(): void {
    // Get the current user
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    // Set form values
    this.profileForm.setValue({
      name: this.user.name || '',
      email: this.user.email || '',
      denomination: this.user.denomination || ''
    });

    // Load user activities
    this.loadActivities();
  }

  loadActivities(): void {
    if (!this.user) {
      this.loading = false;
      return;
    }

    this.userService.getUserActivities(this.user.id)
      .subscribe({
        next: (activities) => {
          this.activities = activities.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading activities', error);
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    // In a real application, you would update the user profile with your backend
    // For now, we'll just update the local storage
    if (this.user) {
      const updatedUser: User = {
        ...this.user,
        name: this.f['name'].value,
        denomination: this.f['denomination'].value
      };

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.authService.currentUser.subscribe((user: any) => {
        this.user = user;
      });

      this.updateMessage = 'Profile updated successfully';
      this.updateSuccess = true;

      // In a real app, you would make an API call here
      // this.userService.updateProfile(updatedUser).subscribe(...)
    }
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login'])
        // .then(r => );
      })
      .catch((error: any) => {
        console.error('Logout error', error);
      });
  }
}
