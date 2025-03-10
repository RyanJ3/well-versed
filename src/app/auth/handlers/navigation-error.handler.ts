// src/app/core/handlers/navigation-error.handler.ts
import { Injectable } from '@angular/core';
import { Router, NavigationError, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationErrorHandler {
  constructor(
    private router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {
    // Subscribe to router events to catch navigation errors
    this.router.events.pipe(
      filter((event: Event): event is NavigationError => event instanceof NavigationError)
    ).subscribe((event: NavigationError) => {
      this.handleNavigationError(event);
    });
  }

  private handleNavigationError(error: NavigationError): void {
    console.error('Navigation error:', error);

    // Handle 404-like navigation errors
    if (error.url && this.isResourceNotFoundError(error)) {
      this.errorHandlerService.redirectTo404();
      return;
    }

    // Handle other navigation errors
    this.errorHandlerService.showErrorModal({
      title: 'Navigation Error',
      message: 'We couldn\'t navigate to the requested page.',
      details: error.error?.message || 'Unknown navigation error'
    });
  }

  private isResourceNotFoundError(error: NavigationError): boolean {
    // This is a simplified check - in a real application, you would need more robust checking
    // Check if error message contains 404-like indicators
    const errorMsg = error.error?.toString().toLowerCase() || '';
    if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      return true;
    }

    // Check if the URL corresponds to a known route
    const knownPaths = ['/', '/login', '/register', '/profile', '/stats', '/flow', '/flashcard', '/not-found'];
    return !knownPaths.some(path => error.url?.startsWith(path));
  }
}
