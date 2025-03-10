// src/app/shared/services/error-handler.service.ts
import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AppError {
  id?: string;
  title: string;
  message: string;
  details?: string;
  showRetry?: boolean;
  retryCallback?: () => void;
}

export enum ErrorType {
  AUTH = 'auth',
  API = 'api',
  NAVIGATION = 'navigation',
  GENERAL = 'general'
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  private errorSubject = new BehaviorSubject<AppError | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(
    private zone: NgZone,
    private router: Router
  ) {}

  // Implemented from ErrorHandler interface
  handleError(error: any): void {
    // Ensure we're in the Angular zone
    this.zone.run(() => {
      console.error('Error caught by error handler:', error);

      if (error instanceof HttpErrorResponse) {
        this.handleHttpError(error);
      } else {
        // Check for navigation errors
        if (error.url && error.type === 'redirect') {
          // This is likely a navigation error
          this.handleNavigationError(error);
          return;
        }

        // Handle authentication errors differently
        if (error.code && error.code.startsWith('auth/')) {
          this.handleAuthError(error);
          return;
        }

        // Handle general errors
        this.showErrorModal({
          title: 'Application Error',
          message: 'An unexpected error occurred.',
          details: this.getErrorDetails(error)
        });
      }
    });
  }

  // Handle HTTP errors specifically
  private handleHttpError(error: HttpErrorResponse): void {
    // Check for 404 errors
    if (error.status === 404) {
      this.redirectTo404();
      return;
    }

    // Handle unauthorized errors (401)
    if (error.status === 401) {
      this.showErrorModal({
        title: 'Authentication Required',
        message: 'Your session has expired. Please log in again.',
        details: `Status: ${error.status}, ${error.statusText}`
      });

      // Redirect to login after a brief delay
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }, 3000);

      return;
    }

    // Handle server errors (5xx)
    if (error.status >= 500) {
      this.showErrorModal({
        title: 'Server Error',
        message: 'We\'re having trouble connecting to our servers.',
        details: `Status: ${error.status}, ${error.statusText}`,
        showRetry: true
      });
      return;
    }

    // Handle client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      this.showErrorModal({
        title: 'Request Error',
        message: this.getClientErrorMessage(error),
        details: `Status: ${error.status}, ${error.statusText}`
      });
      return;
    }

    // Handle other HTTP errors
    this.showErrorModal({
      title: 'Connection Error',
      message: 'There was a problem with your request.',
      details: `Status: ${error.status}, ${error.statusText}`
    });
  }

  // Handle navigation errors
  private handleNavigationError(error: any): void {
    console.log('Navigation error:', error);
    // Check if it's a route not found error
    if (error.url && !this.isKnownRoute(error.url)) {
      this.redirectTo404();
      return;
    }

    // Handle other navigation errors
    this.showErrorModal({
      title: 'Navigation Error',
      message: 'We couldn\'t navigate to the requested page.',
      details: error.message || 'Unknown navigation error'
    });
  }

  // Helper method to check if a route exists
  private isKnownRoute(url: string): boolean {
    // This is a simplified check - in a real app you might want to check against the actual route configuration
    const knownPaths = ['/', '/login', '/register', '/profile', '/stats', '/flow', '/flashcard', '/not-found'];
    return knownPaths.some(path => url.startsWith(path));
  }

  // Redirect to 404 page
  public redirectTo404(): void {
    this.router.navigate(['/not-found']);
  }

  // Handle authentication errors
  private handleAuthError(error: any): void {
    let title = 'Authentication Error';
    let message = 'An error occurred during authentication.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email address is already in use.';
        break;
      case 'auth/invalid-email':
        message = 'The email address is not valid.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak. Please use a stronger password.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Invalid email or password. Please try again.';
        break;
      default:
        message = error.message || 'An unexpected authentication error occurred.';
        break;
    }

    this.showErrorModal({
      title,
      message,
      details: error.code ? `Error code: ${error.code}` : undefined
    });
  }

  // Show operational error modal (for non-navigation errors)
  showErrorModal(error: AppError): void {
    this.errorSubject.next({
      id: this.generateErrorId(),
      ...error
    });
  }

  // Close the error modal
  closeErrorModal(): void {
    this.errorSubject.next(null);
  }

  // Helper to generate appropriate messages for client errors
  private getClientErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return 'The request was invalid.';
      case 401:
        return 'You need to be authenticated to perform this action.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'There was a conflict with the current state of the resource.';
      case 422:
        return 'The request couldn\'t be processed.';
      default:
        return 'An error occurred while processing your request.';
    }
  }

  // Extract error details for developer info
  private getErrorDetails(error: any): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n${error.stack}`;
    }
    return JSON.stringify(error, null, 2);
  }

  // Generate a unique ID for the error
  private generateErrorId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
