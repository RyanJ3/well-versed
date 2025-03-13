// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export const authGuard = () => {
    const oidcSecurityService = inject(OidcSecurityService);
    const router = inject(Router);

    return oidcSecurityService.isAuthenticated$.pipe(
        map(({ isAuthenticated }) => isAuthenticated),
        tap(isAuthenticated => {
            if (!isAuthenticated) {
                // Store the attempted URL for redirecting after login
                const currentUrl = router.url;
                if (currentUrl && currentUrl !== '/' && currentUrl !== '/home') {
                    sessionStorage.setItem('redirectUrl', currentUrl);
                }
                router.navigate(['/']);
            }
        })
    );
};
