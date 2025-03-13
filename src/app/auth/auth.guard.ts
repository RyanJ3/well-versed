// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated$.pipe(
            tap(isAuthenticated => {
                if (!isAuthenticated) {
                    // Store the attempted URL for redirecting after login
                    // sessionStorage.setItem('redirectUrl', this.router.url);
                    this.router.navigate(['/']);
                }
            })
        );
    }
}
