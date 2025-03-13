// src/app/auth/auth.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <ng-container *ngIf="isAuthenticated; else loginButton">
        <div class="user-info">
          <span class="user-name" *ngIf="userData?.name">
            {{ userData?.name }}
          </span>
          <button class="logout-button" (click)="logout()">Logout</button>
        </div>
      </ng-container>

      <ng-template #loginButton>
        <button class="login-button" (click)="login()">Login</button>
      </ng-template>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-name {
      font-weight: 500;
    }

    .login-button, .logout-button {
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .login-button {
      background-color: #2563eb;
      color: white;
    }

    .login-button:hover {
      background-color: #1d4ed8;
    }

    .logout-button {
      background-color: #e5e7eb;
      color: #374151;
    }

    .logout-button:hover {
      background-color: #d1d5db;
    }
  `]
})
export class AuthComponent implements OnInit {
  isAuthenticated = false;
  userData: any = null;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check auth status when component initializes
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('Auth component init - auth status:', isAuthenticated);
      console.log('User data:', userData);
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;
    });

    // Subscribe to auth status changes
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        console.log('Auth status changed:', isAuthenticated);
        this.isAuthenticated = isAuthenticated;
      }
    );

    // Subscribe to user data changes
    this.oidcSecurityService.userData$.subscribe(userData => {
      console.log('User data updated:', userData);
      this.userData = userData;
    });
  }

  login(): void {
    console.log('Login button clicked, triggering authorization...');
    try {
      // Store current route for redirect after login
      const currentUrl = this.router.url;
      if (currentUrl && currentUrl !== '/' && currentUrl !== '/home') {
        sessionStorage.setItem('redirectUrl', currentUrl);
      }

      // Trigger authorization
      this.oidcSecurityService.authorize();
    } catch (error) {
      console.error('Error during authorization:', error);
    }
  }

  logout(): void {
    console.log('Logout button clicked');
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(
      result => {
        console.log('Logged out successfully', result);
      },
      error => {
        console.error('Error during logout:', error);
      }
    );
  }
}
