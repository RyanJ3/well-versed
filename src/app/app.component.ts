// src/app/app.component.ts
import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Well Versed';
  menuActive = false;
  userMenuActive = false;
  memorizeMenuActive = false;

  constructor() {
  }

  private readonly oidcSecurityService = inject(OidcSecurityService);

  configuration$ = this.oidcSecurityService.getConfiguration();

  userData$ = this.oidcSecurityService.userData$;

  isAuthenticated = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;

        console.warn('authenticated: ', isAuthenticated);
      }
    );
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
  login(): void {
    this.oidcSecurityService.authorize();
  }

  /**
   * Logout the user
   */
  logout(): void {
    // Clear session storage
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
    this.oidcSecurityService.logoff().subscribe();
  }
}
