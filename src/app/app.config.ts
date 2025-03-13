// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // Added withFetch() to address the warning
    provideClientHydration(),
    // Import auth providers directly at the application root
    importProvidersFrom(
      AuthModule.forRoot({
        config: {
          authority: environment.auth.authority,
          redirectUrl: environment.auth.redirectUrl,
          clientId: environment.auth.clientId,
          scope: 'email openid phone profile',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
        },
      })
    )
  ]
};
