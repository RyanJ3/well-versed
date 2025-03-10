// src/app/shared/services/alert.service.ts
import { Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {AlertType} from '../notification/alert-modal.component';

export interface Alert {
  id?: string;
  type?: AlertType;
  title?: string;
  message?: string;
  details?: string;
  showCancel?: boolean;
  showRetry?: boolean;
  confirmText?: string;
  cancelText?: string;
  retryText?: string;
  showIcon?: boolean;
  confirmCallback?: () => void;
  cancelCallback?: () => void;
  retryCallback?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  public alert$ = this.alertSubject.asObservable();

  constructor(
    private zone: NgZone,
    private router: Router
  ) {}

  // Show an information alert
  showInfo(message: string, title: string = 'Information', options: Partial<Alert> = {}): void {
    this.showAlert({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  // Show a success alert
  showSuccess(message: string, title: string = 'Success', options: Partial<Alert> = {}): void {
    this.showAlert({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  // Show a warning alert
  showWarning(message: string, title: string = 'Warning', options: Partial<Alert> = {}): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  // Show an error/danger alert
  showError(message: string, title: string = 'Error', options: Partial<Alert> = {}): void {
    this.showAlert({
      type: 'danger',
      title,
      message,
      ...options
    });
  }

  // Show a confirmation alert
  showConfirmation(message: string, title: string = 'Confirm', confirmCallback?: () => void, cancelCallback?: () => void): void {
    this.showAlert({
      type: 'warning',
      title,
      message,
      showCancel: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      confirmCallback,
      cancelCallback
    });
  }

  // Handle HTTP errors
  handleHttpError(error: HttpErrorResponse): void {
    // Handle different HTTP status codes
    switch (error.status) {
      case 401:
        this.showAlert({
          type: 'danger',
          title: 'Authentication Required',
          message: 'Your session has expired. Please log in again.',
          details: `Status: ${error.status}, ${error.statusText}`,
          confirmText: 'Go to Login',
          confirmCallback: () => {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
          }
        });
        break;

      case 403:
        this.showAlert({
          type: 'danger',
          title: 'Access Denied',
          message: 'You don\'t have permission to access this resource.',
          details: `Status: ${error.status}, ${error.statusText}`
        });
        break;

      case 404:
        this.redirectTo404();
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        this.showAlert({
          type: 'danger',
          title: 'Server Error',
          message: 'We\'re having trouble connecting to our servers.',
          details: `Status: ${error.status}, ${error.statusText}`,
          showRetry: true,
          retryText: 'Try Again'
        });
        break;

      default:
        this.showAlert({
          type: 'danger',
          title: 'Error',
          message: 'An unexpected error occurred.',
          details: error.message
        });
        break;
    }
  }

  // Handle auth errors
  handleAuthError(error: any): void {
    let message = 'Authentication failed';
    let details = '';

    if (error.code) {
      details = `Error code: ${error.code}`;

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password. Please try again.';
          break;
        case 'auth/email-already-in-use':
          message = 'This email address is already in use.';
          break;
        case 'auth/weak-password':
          message = 'The password is too weak. Please use a stronger password.';
          break;
        case 'auth/invalid-email':
          message = 'The email address format is invalid.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        default:
          message = error.message || 'An unexpected authentication error occurred.';
      }
    }

    this.showAlert({
      type: 'danger',
      title: 'Authentication Error',
      message,
      details,
      showRetry: true,
      retryText: 'Try Again'
    });
  }

  // Redirect to 404 page
  redirectTo404(): void {
    this.router.navigate(['/not-found']);
  }

  // Show alert modal
  showAlert(alert: Partial<Alert>): void {
    this.zone.run(() => {
      this.alertSubject.next({
        id: this.generateAlertId(),
        type: 'info',
        title: 'Alert',
        message: '',
        showIcon: true,
        confirmText: 'OK',
        ...alert as Alert
      });
    });
  }

  // Close alert modal
  closeAlert(): void {
    this.alertSubject.next(null);
  }

  // Generate a unique ID for the alert
  private generateAlertId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
