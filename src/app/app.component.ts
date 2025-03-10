// src/app/app.component.ts
import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="logo-container">
          <h1 class="app-title">
            <span class="app-title-text">Well Versed</span>
          </h1>
        </div>

        <button class="menu-toggle" (click)="toggleMenu()">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <nav class="app-nav" [class.active]="menuActive">
          <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"
             (click)="closeMenu()">Home</a>

          <!-- Memorize dropdown menu -->
          <div class="nav-dropdown">
            <button class="nav-link dropdown-toggle" [class.active]="memorizeMenuActive" (click)="toggleMemorizeMenu($event)">
              Memorize
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="dropdown-icon" [class.rotate]="memorizeMenuActive">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="dropdown-menu" [class.active]="memorizeMenuActive">
              <a routerLink="/flow" class="dropdown-item" routerLinkActive="active" (click)="closeMenu()">FLOW</a>
              <a routerLink="/flashcard" class="dropdown-item" routerLinkActive="active" (click)="closeMenu()">Flashcard</a>
              <!-- Add other memorization tools here in the future -->
            </div>
          </div>
        </nav>

        <!-- User menu with icon -->
        <div class="user-menu-container">
          <button class="user-icon-button" (click)="toggleUserMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="user-icon">
              <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <div class="user-menu" [class.active]="userMenuActive">
            <a routerLink="/stats" class="user-menu-item" routerLinkActive="active" (click)="closeUserMenu()">Stats</a>

            <!-- Authentication Links -->
            <ng-container *ngIf="!authService.isAuthenticated()">
              <a routerLink="/login" class="user-menu-item" routerLinkActive="active" (click)="closeUserMenu()">Login</a>
              <a routerLink="/register" class="user-menu-item" routerLinkActive="active" (click)="closeUserMenu()">Register</a>
            </ng-container>
            <ng-container *ngIf="authService.isAuthenticated()">
              <a routerLink="/profile" class="user-menu-item" routerLinkActive="active" (click)="closeUserMenu()">Profile</a>
              <a (click)="logout(); closeUserMenu()" class="user-menu-item">Logout</a>
            </ng-container>
          </div>
        </div>
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

    /* User menu styles */
    .user-menu-container {
      position: relative;
      margin-left: 16px;
    }

    .user-icon-button {
      background: transparent;
      border: none;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4b5563;
      transition: all 0.2s ease;
    }

    .user-icon-button:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .user-icon {
      width: 24px;
      height: 24px;
    }

    .user-menu {
      position: absolute;
      top: 110%;
      right: 0;
      width: 200px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 30;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .user-menu.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .user-menu-item {
      display: block;
      padding: 12px 16px;
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
    }

    .user-menu-item:last-child {
      border-bottom: none;
    }

    .user-menu-item:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .user-menu-item.active {
      background-color: #e0f2fe;
      color: #1d4ed8;
      font-weight: 600;
    }

    /* Dropdown menu styles */
    .nav-dropdown {
      position: relative;
    }

    .dropdown-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
    }

    .dropdown-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    .dropdown-icon.rotate {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      width: 200px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 30;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .dropdown-menu.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(5px);
    }

    .dropdown-item {
      display: block;
      padding: 10px 16px;
      color: #4b5563;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border-bottom: 1px solid #f3f4f6;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background-color: #f3f4f6;
      color: #2563eb;
    }

    .dropdown-item.active {
      background-color: #e0f2fe;
      color: #1d4ed8;
      font-weight: 600;
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

      /* Mobile dropdown adjustments */
      .dropdown-menu {
        position: static;
        width: 100%;
        box-shadow: none;
        border-radius: 0;
        background-color: #f7f9fc;
        margin-bottom: 5px;
        display: none;
      }

      .dropdown-menu.active {
        display: block;
        transform: none;
        opacity: 1;
        visibility: visible;
      }

      .dropdown-item {
        padding-left: 30px;
      }

      .app-title {
        font-size: 20px;
      }

      /* Mobile user menu adjustments */
      .user-menu {
        width: 180px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Well Versed';
  menuActive = false;
  userMenuActive = false;
  memorizeMenuActive = false;

  constructor(public authService: AuthService) {
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    // Close other menus when main menu is toggled
    this.userMenuActive = false;
    this.memorizeMenuActive = false;
  }

  toggleUserMenu(): void {
    this.userMenuActive = !this.userMenuActive;
    // Close other menus when user menu is toggled
    this.menuActive = false;
    this.memorizeMenuActive = false;
  }

  toggleMemorizeMenu(event: Event): void {
    event.stopPropagation(); // Prevent the click from closing the main nav on mobile
    this.memorizeMenuActive = !this.memorizeMenuActive;
  }

  closeMenu(): void {
    this.menuActive = false;
    this.memorizeMenuActive = false;
  }

  closeUserMenu(): void {
    this.userMenuActive = false;
  }

  closeMemorizeMenu(): void {
    this.memorizeMenuActive = false;
  }

  logout(): void {
    this.authService.logout();
  }
}
