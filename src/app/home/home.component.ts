// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Login Page for Unauthenticated Users -->
    <div class="login-container" *ngIf="!isAuthenticated">
      <div class="login-card">
        <h1 class="login-title">Welcome to <span class="app-name">Well Versed</span></h1>
        <p class="login-subtitle">Sign in to access scripture memorization tools</p>
        <button class="login-button" (click)="login()">Sign In</button>
      </div>
    </div>

    <!-- Home Page Content for Authenticated Users -->
    <div class="home-container" *ngIf="isAuthenticated">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to <span class="app-name">Well Versed</span></h1>
          <p class="hero-subtitle">Master scripture memorization with our powerful tools</p>
          <div class="cta-buttons">
            <a routerLink="/flow" class="cta-button primary">Try FLOW Method</a>
            <a routerLink="/flashcard" class="cta-button secondary">Use Flashcards</a>
          </div>
        </div>
      </section>

      <!-- Home page content as before -->
      <!-- ... -->
    </div>
  `,
  styles: [`
    /* Login Page Styles */
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      background: linear-gradient(135deg, #e6f2ff 0%, #f0f7ff 100%);
      border-radius: 12px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
      max-width: 500px;
      width: 90%;
    }

    .login-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1e3a8a;
    }

    .login-subtitle {
      color: #4b5563;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }

    .login-button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .login-button:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    /* App name styling */
    .app-name {
      background: linear-gradient(90deg, #1e3a8a, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    /* Home page styles (simplified for this example) */
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .hero-section {
      padding: 4rem 0;
      text-align: center;
      background: linear-gradient(to right, #e6f2ff, #f0f7ff);
      border-radius: 12px;
      margin-bottom: 3rem;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #1e3a8a;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: #4b5563;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .cta-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-button.primary {
      background-color: #3b82f6;
      color: white;
    }

    .cta-button.primary:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }

    .cta-button.secondary {
      background-color: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }

    .cta-button.secondary:hover {
      background-color: #f0f7ff;
      transform: translateY(-2px);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .hero-title, .login-title {
        font-size: 2rem;
      }

      .login-card {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Home component initialized');

    // Check the auth status when the component initializes
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      console.log('Home component - auth status:', isAuthenticated);
      this.isAuthenticated = isAuthenticated;

      // If authenticated and on root path or landing, redirect to home
      if (isAuthenticated && (window.location.pathname === '/' || window.location.pathname === '/landing')) {
        console.log('Redirecting to /home because user is authenticated');
        this.router.navigate(['/home']);
      }

      // Handle callback logic
      if (window.location.pathname.includes('/callback')) {
        if (isAuthenticated) {
          // If we just authenticated via callback, go to home
          console.log('Callback processed, redirecting to home');
          this.router.navigate(['/home']);
        }
      }
    });

    // Subscribe to auth status changes
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      console.log('Home component - auth status changed:', isAuthenticated);
      this.isAuthenticated = isAuthenticated;

      // If user becomes authenticated while on the landing page, redirect to home
      if (isAuthenticated && (window.location.pathname === '/' || window.location.pathname === '/landing')) {
        this.router.navigate(['/home']);
      }
    });
  }

  login(): void {
    console.log('Login button clicked, triggering authorization...');
    try {
      // Trigger authorization flow
      this.oidcSecurityService.authorize();
    } catch (error) {
      console.error('Error during authorization:', error);
    }
  }
}
