// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { FlowMemorizationComponent } from './flow-memorization/flow-memorization.component';
import { BibleTrackerComponent } from './bible-tracker/bible-tracker.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./register/register.component";

export const routes: Routes = [
  { path: '', component: BibleTrackerComponent },  // Home page
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'stats', component: BibleTrackerComponent }, // stats page
  { path: 'flow-memorization', component: FlowMemorizationComponent },  // FLOW memorization tool route
  { path: '**', redirectTo: '' }  // Catch all other routes and redirect to home
];
