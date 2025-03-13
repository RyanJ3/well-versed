// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, ErrorHandler } from '@angular/core';
import { provideRouter, withComponentInputBinding, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environment/environment';
import {ErrorHandlingService} from './auth/auth.service';
import {httpErrorInterceptor} from './auth/http-error.interceptor';

// Global error handler
class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorService: ErrorHandlingService) {}

  handleError(error: any): void {
    console.error('Global error handler caught an error:', error);

    // Handle application errors by redirecting to error pages
    // Skip StsConfigLoader error which is a known issue with the OIDC library
    if (!(error instanceof Error && error.message?.includes('No provider for StsConfigLoader'))) {
      this.errorService.handleRouteError(error);
    }
  }
}

// Provider for global error handler
export function globalErrorHandlerFactory(errorService: ErrorHandlingService) {
  return new GlobalErrorHandler(errorService);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withNavigationErrorHandler((error) => {
        const errorService = new ErrorHandlingService(null as any); // This is a workaround, in a real app use proper DI
        errorService.handleRouteError(error);
      })
    ),
    provideHttpClient(
      withFetch(),  // Added withFetch() to address the warning
      withInterceptors([httpErrorInterceptor])
    ),
    provideClientHydration(),
    // Import auth providers directly at the application root
    importProvidersFrom(
      AuthModule.forRoot({
        config: {
          authority: environment.auth.authority,
          redirectUrl: environment.auth.redirectUrl,
          clientId: environment.auth.clientId,
          scope: 'openid profile email',  // Standard OpenID Connect scopes
          responseType: 'code',  // Use authorization code flow
          silentRenew: true,  // Enable token renewal
          useRefreshToken: true,  // Use refresh tokens for renewal
          postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
          logLevel: LogLevel.Debug,  // Enable debug logging during development
          // AWS Cognito specific settings
          customParamsAuthRequest: {
            // You can add AWS Cognito specific params here if needed
          },
          // Disable NONCE validation since some versions of AWS Cognito don't support it
          // disableNonceValidation: true,
          historyCleanupOff: true
        },
      })
    ),
    // Register the global error handler
    {
      provide: ErrorHandler,
      useFactory: globalErrorHandlerFactory,
      deps: [ErrorHandlingService]
    },
    // Provide the error handling service
    ErrorHandlingService
  ]
};
