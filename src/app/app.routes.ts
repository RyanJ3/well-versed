// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { BibleTrackerComponent } from './bible-tracker/bible-tracker.component';
import { FlowMemorizationComponent } from './memorization/flow/flow-memorization.component';
import { FlashcardComponent } from './memorization/flashcard/flashcard.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './auth/error-page.component';

export const routes: Routes = [
  // Public routes - root path shows login page without a guard
  { path: '', component: HomeComponent },
  { path: 'landing', component: HomeComponent },

  // Home route (protected, requires authentication)
  { path: 'home', component: HomeComponent, canActivate: [() => authGuard()] },

  // Cognito authentication callback route
  { path: 'callback', component: HomeComponent },

  // Protected routes (require authentication)
  { path: 'tracker', component: BibleTrackerComponent, canActivate: [() => authGuard()] },
  { path: 'stats', component: BibleTrackerComponent, canActivate: [() => authGuard()] },
  { path: 'flow', component: FlowMemorizationComponent, canActivate: [() => authGuard()] },
  { path: 'flashcard', component: FlashcardComponent, canActivate: [() => authGuard()] },

  // Error pages
  { path: 'error/:status', component: ErrorPageComponent },

  // Handle specific error redirects
  { path: '401', redirectTo: 'error/401' },
  { path: '403', redirectTo: 'error/403' },
  { path: '404', redirectTo: 'error/404' },
  { path: '500', redirectTo: 'error/500' },

  // Catch-all route (404)
  { path: '**', redirectTo: 'error/404' }
];
