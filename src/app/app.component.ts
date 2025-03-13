// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthComponent } from './auth/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, AuthComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Well Versed';
  menuActive = false;
  userMenuActive = false;
  memorizeMenuActive = false;

  // Auth-related properties (used in template)
  isAuthenticated = false;
  userData$ ;

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.userData$ = {}
  }

  ngOnInit(): void {
    // Check authentication status on app initialization
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      console.log('App authentication status:', isAuthenticated);
      this.isAuthenticated = isAuthenticated;
    });

    // Subscribe to authentication state changes
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
    this.userData$ = this.oidcSecurityService.userData$
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
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe(result => {
      console.log('Logged out', result);
    });
  }
}
