// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private configId = 'well-versed-auth';

    constructor(private oidcSecurityService: OidcSecurityService) {}

    /**
     * Check if user is authenticated
     */
    get isAuthenticated$(): Observable<boolean> {
        return this.oidcSecurityService.isAuthenticated$.pipe(
            map(({ isAuthenticated }) => isAuthenticated)
        );
    }

    /**
     * Get user data
     */
    get userData$(): Observable<any> {
        return this.oidcSecurityService.userData$;
    }

    /**
     * Get the configuration
     */
    get configuration$(): Observable<any> {
        return this.oidcSecurityService.getConfiguration(this.configId);
    }

    /**
     * Initialize authentication
     */
    checkAuth(): Observable<any> {
        return this.oidcSecurityService.checkAuth(this.configId);
    }

    /**
     * Start the login process
     */
    login(): void {
        this.oidcSecurityService.authorize(this.configId);
    }

    /**
     * Logout the user
     */
    logout(): void {
        // Clear session storage
        if (window.sessionStorage) {
            window.sessionStorage.clear();
        }
        this.oidcSecurityService.logoffLocal();
        this.oidcSecurityService.logoff(this.configId).subscribe();
    }
}
