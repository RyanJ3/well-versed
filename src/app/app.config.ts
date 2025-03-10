// src/app/app.config.ts
import {ApplicationConfig, ErrorHandler, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {NavigationErrorHandler} from './auth/handlers/navigation-error.handler';
import {ErrorHandlerService} from './auth/handlers/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    // Ensure NavigationErrorHandler is initialized
    NavigationErrorHandler,
    // Add the custom error handler
    { provide: ErrorHandler, useClass: ErrorHandlerService }
  ]
};
