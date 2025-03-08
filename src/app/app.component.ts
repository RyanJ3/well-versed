// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from './register/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo-container">
          <h1 class="app-title">
            <span class="app-title-text">Bible App</span>
          </h1>
        </div>

        <button class="menu-toggle" (click)="toggleMenu()">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <nav class="app-nav" [class.active]="menuActive">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Home</a>
          <a routerLink="/flow-memorization" class="nav-link" routerLinkActive="active" (click)="closeMenu()">FLOW Memorization</a>
          <a routerLink="/stats" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Stats</a>

          <!-- Authentication Links -->
          <ng-container *ngIf="!authService.isAuthenticated()">
            <a routerLink="/login" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Login</a>
            <a routerLink="/register" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Register</a>
          </ng-container>
          <ng-container *ngIf="authService.isAuthenticated()">
            <a routerLink="/profile" class="nav-link" routerLinkActive="active" (click)="closeMenu()">Profile</a>
            <a (click)="logout(); closeMenu()" class="nav-link">Logout</a>
          </ng-container>
        </nav>
      </header>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
<!--        <p>&copy; 2025 TODO WellVersed App. All rights reserved.</p>-->
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      padding: 15px 0;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
    }

    .logo-container {
      display: flex;
      align-items: center;
    }

    .app-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1e3a8a;
      display: flex;
      align-items: center;
    }

    .app-title-text {
      background: linear-gradient(90deg, #1e3a8a, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .app-nav {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      padding: 8px 12px;
      text-decoration: none;
      color: #4b5563;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
    }

    .nav-link:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .nav-link.active {
      background-color: #e0f2fe;
      color: #1d4ed8;
      font-weight: 600;
    }

    .app-content {
      flex: 1;
      padding: 20px 0;
    }

    .app-footer {
      margin-top: auto;
      padding: 20px 0;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }

    .menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 24px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 20;
    }

    .bar {
      width: 100%;
      height: 3px;
      background-color: #4b5563;
      border-radius: 3px;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: flex;
      }

      .app-nav {
        position: fixed;
        right: -100%;
        top: 0;
        width: 70%;
        max-width: 300px;
        height: 100%;
        background-color: white;
        flex-direction: column;
        padding: 80px 20px 30px;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
        z-index: 10;
      }

      .app-nav.active {
        right: 0;
      }

      .nav-link {
        padding: 12px 15px;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid #f3f4f6;
      }

      .app-title {
        font-size: 20px;
      }
    }
  `]
})
export class AppComponent {
  // TODO change to WellVersed
  title = 'Bible App';
  menuActive = false;

  constructor(public authService: AuthService) {}

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  closeMenu(): void {
    this.menuActive = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
