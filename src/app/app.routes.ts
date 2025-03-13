// src/app/app.routes.ts
import {Routes} from '@angular/router';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';
import {FlowMemorizationComponent} from './memorization/flow/flow-memorization.component';
import {FlashcardComponent} from './memorization/flashcard/flashcard.component';
import {map} from 'rxjs/operators';

// Create a simple auth guard function using the oidcSecurityService
export function authGuard(oidcSecurityService: any) {
  return () =>
    oidcSecurityService.isAuthenticated$.pipe(
      map((isAuthed: any) => {
        if (!isAuthed.isAuthenticated) {
          // Store the attempted URL for redirecting after login
          sessionStorage.setItem('redirectUrl', oidcSecurityService.router.url);
          return false;
        }
        return true;
      })
    );
}

export const routes: Routes = [
  {path: '', component: BibleTrackerComponent},  // Home page
  {path: 'stats', component: BibleTrackerComponent, canActivate: [authGuard]}, // stats page (protected)
  {path: 'flow', component: FlowMemorizationComponent, canActivate: [authGuard]},  // FLOW memorization tool route (protected)
  {path: 'flashcard', component: FlashcardComponent, canActivate: [authGuard]},  // Flashcard memorization tool (protected)

  // Auth callback route
  // {path: 'callback', component: AuthCallbackComponent},

  // Catch-all route (404)
  {path: '**', redirectTo: ''}
];
