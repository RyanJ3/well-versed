// src/app/shared/services/alert-error.handler.ts
import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {AlertService} from '../../auth/handlers/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AlertErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private alertService: AlertService
  ) {}

  // Implemented from ErrorHandler interface
  handleError(error: any): void {
    // Ensure we're in the Angular zone
    this.zone.run(() => {
      console.error('Error caught by AlertErrorHandler:', error);

      if (error instanceof HttpErrorResponse) {
        this.alertService.handleHttpError(error);
      } else {
        // Check for specific error types

        // Handle authentication errors
        if (error.code && error.code.startsWith('auth/')) {
          this.alertService.handleAuthError(error);
          return;
        }

        // Check for navigation errors
        if (error.url && error.type === 'redirect') {
          // This is likely a navigation error
          this.handleNavigationError(error);
          return;
        }

        // Handle general errors
        this.alertService.showError(
          'An unexpected error occurred.',
          'Application Error',
          {
            details: this.getErrorDetails(error)
          }
        );
      }
    });
  }

  // Handle navigation errors
  private handleNavigationError(error: any): void {
    console.log('Navigation error:', error);

    // Check if it's a route not found error
    if (error.url && !this.isKnownRoute(error.url)) {
      this.alertService.redirectTo404();
      return;
    }

    // Handle other navigation errors
    this.alertService.showError(
      'We couldn\'t navigate to the requested page.',
      'Navigation Error',
      {
        details: error.message || 'Unknown navigation error'
      }
    );
  }

  // Helper method to check if a route exists
  private isKnownRoute(url: string): boolean {
    // This is a simplified check - in a real app you might want to check against the actual route configuration
    const knownPaths = ['/', '/login', '/register', '/profile', '/stats', '/flow', '/flashcard', '/not-found'];
    return knownPaths.some(path => url.startsWith(path));
  }

  // Extract error details for developer info
  private getErrorDetails(error: any): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n${error.stack}`;
    }

    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  }
}
