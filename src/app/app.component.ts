// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Well Versed';
  menuActive = false;
  userMenuActive = false;
  memorizeMenuActive = false;

  // Auth-related properties
  isAuthenticated = false;
  userData: any = null;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication status on app initialization
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('App authentication status:', isAuthenticated);
      this.isAuthenticated = isAuthenticated;
      this.userData = userData;

      // If already authenticated and on root path, redirect to home
      if (isAuthenticated && (window.location.pathname === '/' || window.location.pathname === '/landing')) {
        this.router.navigate(['/home']);
      }
    });

    // Subscribe to authentication state changes
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    // Subscribe to user data changes
    this.oidcSecurityService.userData$.subscribe(userData => {
      this.userData = userData;
    });
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

  // Auth methods
  login(): void {
    console.log('App component login button clicked');
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('App component logout button clicked');
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }

    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(result => {
      console.log('Logged out', result);
    });
  }
}
