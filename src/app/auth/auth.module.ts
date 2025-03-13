// src/app/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule as OidcAuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OidcAuthModule.forRoot({
      config: [
        {
          configId: 'well-versed-auth',
          authority: environment.auth.authority,
          redirectUrl: environment.auth.redirectUrl,
          clientId: environment.auth.clientId,
          scope: 'email openid phone profile',
          responseType: 'code',
          silentRenew: true,
          useRefreshToken: true,
          postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
          // Add logging for debugging
          logLevel: LogLevel.Debug,
          // Disable auto silent renew during development
          renewTimeBeforeTokenExpiresInSeconds: 30,
        }
      ]
    }),
  ],
  exports: [OidcAuthModule],
})
export class AuthModule {}
