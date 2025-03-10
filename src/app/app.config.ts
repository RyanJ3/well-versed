// src/app/app.config.ts
import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NavigationErrorHandler } from './auth/handlers/navigation-error.handler';
import {AlertErrorHandler} from './shared/services/error-handler.handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    // Register the navigation error handler
    NavigationErrorHandler,
    // Register the new alert-based error handler
    { provide: ErrorHandler, useClass: AlertErrorHandler }
  ]
};
