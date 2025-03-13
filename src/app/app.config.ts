// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom, ErrorHandler } from '@angular/core';
import { provideRouter, withComponentInputBinding, withNavigationErrorHandler } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environment/environment';
import { ErrorHandlingService } from './auth/auth.service';
import { httpErrorInterceptor } from './auth/http-error.interceptor';

// Global error handler
class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorService: ErrorHandlingService) {}

  handleError(error: any): void {
    console.error('Global error handler caught an error:', error);

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
      withFetch(),
      withInterceptors([httpErrorInterceptor])
    ),
    provideClientHydration(),
    // Auth module configuration
    importProvidersFrom(
      AuthModule.forRoot({
        config: {
          authority: environment.auth.authority,
          redirectUrl: environment.auth.redirectUrl, // Ensure this is a full URL
          clientId: environment.auth.clientId,
          scope: 'openid profile email',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          postLogoutRedirectUri: environment.auth.postLogoutRedirectUri, // Use origin for logout redirect
          logLevel: LogLevel.Debug, // Set to Debug for troubleshooting
          historyCleanupOff: true,
          customParamsAuthRequest: {
            // Add any AWS Cognito specific params here if needed
          },
          // Increase token renewal time for better UX
          renewTimeBeforeTokenExpiresInSeconds: 60
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
