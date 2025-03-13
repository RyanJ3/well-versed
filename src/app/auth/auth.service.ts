// src/app/shared/services/error-handling.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private router: Router) { }

  /**
   * Handle HTTP errors by navigating to the appropriate error page
   * @param error The HTTP error response
   */
  handleHttpError(error: HttpErrorResponse): void {
    // Navigate to the appropriate error page based on status code
    if (error.status) {
      this.navigateToErrorPage(error.status.toString());
    } else {
      // Generic error handling for non-HTTP errors
      this.navigateToErrorPage('500');
    }
  }

  /**
   * Handle route errors by navigating to the appropriate error page
   * @param error The error object
   */
  handleRouteError(error: any): void {
    let errorCode = '500';

    // Try to determine if this is a specific type of error
    if (error && error.status) {
      errorCode = error.status.toString();
    } else if (error && error.rejection && error.rejection.status) {
      errorCode = error.rejection.status.toString();
    } else if (error && error.message) {
      // Analyze error message to determine type
      if (error.message.includes('Cannot match any routes')) {
        errorCode = '404';
      }
    }

    this.navigateToErrorPage(errorCode);
  }

  /**
   * Navigate to a specific error page
   * @param statusCode The HTTP status code
   */
  navigateToErrorPage(statusCode: string): void {
    // Check for common status codes
    switch (statusCode) {
      case '400':
      case '401':
      case '403':
      case '404':
      case '405':
      case '500':
      case '502':
      case '503':
      case '504':
        this.router.navigate(['/error', statusCode]);
        break;
      default:
        // Use a generic error for uncommon codes
        this.router.navigate(['/error', '500']);
    }
  }

  /**
   * Manually show a specific error page
   * @param statusCode The HTTP status code to display
   */
  showErrorPage(statusCode: string = '404'): void {
    this.navigateToErrorPage(statusCode);
  }
}
