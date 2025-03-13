// src/app/shared/components/error-page/error-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon" [ngClass]="errorClass">
          <svg *ngIf="errorType === 'not-found'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <svg *ngIf="errorType === 'server-error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <svg *ngIf="errorType === 'forbidden'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <svg *ngIf="errorType === 'default'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-message">{{ errorMessage }}</p>
        
        <div class="error-actions">
          <button class="error-action-button primary" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Go Back
          </button>
          
          <button class="error-action-button secondary" routerLink="/">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background-color: #f9fafb;
    }
    
    .error-content {
      max-width: 600px;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .error-icon {
      margin: 0 auto 2rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .error-icon svg {
      width: 50px;
      height: 50px;
    }
    
    .error-icon.not-found {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .error-icon.server-error {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    .error-icon.forbidden {
      background-color: #fef3c7;
      color: #92400e;
    }
    
    .error-icon.default {
      background-color: #e5e7eb;
      color: #374151;
    }
    
    .error-code {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #111827;
    }
    
    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #1f2937;
    }
    
    .error-message {
      font-size: 1rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }
    
    .error-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .error-action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }
    
    .error-action-button.primary {
      background-color: #3b82f6;
      color: white;
    }
    
    .error-action-button.primary:hover {
      background-color: #2563eb;
    }
    
    .error-action-button.secondary {
      background-color: #e5e7eb;
      color: #374151;
    }
    
    .error-action-button.secondary:hover {
      background-color: #d1d5db;
    }
    
    .action-icon {
      width: 16px;
      height: 16px;
    }
    
    @media (max-width: 640px) {
      .error-content {
        padding: 2rem 1rem;
      }
      
      .error-code {
        font-size: 2.5rem;
      }
      
      .error-title {
        font-size: 1.25rem;
      }
      
      .error-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ErrorPageComponent implements OnInit {
  errorCode: string = '404';
  errorTitle: string = 'Page Not Found';
  errorMessage: string = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
  errorType: 'not-found' | 'server-error' | 'forbidden' | 'default' = 'not-found';
  errorClass: string = 'not-found';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the status code from route data
    this.route.paramMap.subscribe(params => {
      const status = params.get('status');
      this.setErrorInfo(status);
    });
  }

  setErrorInfo(status: string | null): void {
    if (!status) {
      status = '404';
    }

    switch (status) {
      case '400':
        this.errorCode = '400';
        this.errorTitle = 'Bad Request';
        this.errorMessage = 'The request could not be understood by the server due to malformed syntax.';
        this.errorType = 'default';
        this.errorClass = 'default';
        break;
      
      case '401':
        this.errorCode = '401';
        this.errorTitle = 'Unauthorized';
        this.errorMessage = 'You need to be authenticated to access this page.';
        this.errorType = 'forbidden';
        this.errorClass = 'forbidden';
        break;
      
      case '403':
        this.errorCode = '403';
        this.errorTitle = 'Forbidden';
        this.errorMessage = "You don't have permission to access this page.";
        this.errorType = 'forbidden';
        this.errorClass = 'forbidden';
        break;
      
      case '404':
        this.errorCode = '404';
        this.errorTitle = 'Page Not Found';
        this.errorMessage = 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.';
        this.errorType = 'not-found';
        this.errorClass = 'not-found';
        break;
      
      case '405':
        this.errorCode = '405';
        this.errorTitle = 'Method Not Allowed';
        this.errorMessage = 'The method specified in the request is not allowed for the resource.';
        this.errorType = 'not-found';
        this.errorClass = 'not-found';
        break;
      
      case '500':
        this.errorCode = '500';
        this.errorTitle = 'Internal Server Error';
        this.errorMessage = 'The server encountered an unexpected condition that prevented it from fulfilling the request.';
        this.errorType = 'server-error';
        this.errorClass = 'server-error';
        break;
      
      case '502':
        this.errorCode = '502';
        this.errorTitle = 'Bad Gateway';
        this.errorMessage = 'The server received an invalid response from the upstream server.';
        this.errorType = 'server-error';
        this.errorClass = 'server-error';
        break;
      
      case '503':
        this.errorCode = '503';
        this.errorTitle = 'Service Unavailable';
        this.errorMessage = 'The server is currently unable to handle the request due to temporary overloading or maintenance.';
        this.errorType = 'server-error';
        this.errorClass = 'server-error';
        break;
      
      case '504':
        this.errorCode = '504';
        this.errorTitle = 'Gateway Timeout';
        this.errorMessage = 'The server did not receive a timely response from the upstream server.';
        this.errorType = 'server-error';
        this.errorClass = 'server-error';
        break;
      
      default:
        this.errorCode = status;
        this.errorTitle = 'Unexpected Error';
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
        this.errorType = 'default';
        this.errorClass = 'default';
    }
  }

  goBack(): void {
    window.history.back();
  }
}
