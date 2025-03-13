// src/app/auth/auth.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <ng-container *ngIf="isAuthenticated; else loginButton">
        <div class="user-info">
          <span class="user-name" *ngIf="userData.userData?.name">
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

  constructor(private oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;
    });

    this.oidcSecurityService.isAuthenticated$.subscribe(
        ({ isAuthenticated }) => {
          this.isAuthenticated = isAuthenticated;
        }
    );

    this.oidcSecurityService.userData$.subscribe(userData => {
      this.userData = userData;
    });
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(result => {
      console.log('Logged out', result);
    });
  }
}
