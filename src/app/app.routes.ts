// src/app/app.routes.ts
import {Routes} from '@angular/router';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from './auth/register/register.component';
import {ProfileComponent} from './shared/components/profile/profile.component';
import {AuthGuard} from './auth/auth.guard';
import {FlowMemorizationComponent} from './memorization/flow/flow-memorization.component';
import {FlashcardComponent} from './memorization/flashcard/flashcard.component';

export const routes: Routes = [
  {path: '', component: BibleTrackerComponent},  // Home page
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {path: 'stats', component: BibleTrackerComponent}, // stats page
  {path: 'flow', component: FlowMemorizationComponent},  // FLOW memorization tool route
  {path: 'flashcard', component: FlashcardComponent},  // Flashcard memorization tool
  {path: '**', redirectTo: ''}  // Catch all other routes and redirect to home
];
