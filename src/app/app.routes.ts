// src/app/app.routes.ts
import {Routes} from '@angular/router';
import {BibleTrackerComponent} from './bible-tracker/bible-tracker.component';
import {FlowMemorizationComponent} from './memorization/flow/flow-memorization.component';
import {FlashcardComponent} from './memorization/flashcard/flashcard.component';
export const routes: Routes = [
  {path: '', component: BibleTrackerComponent},  // Home page
  {path: 'stats', component: BibleTrackerComponent}, // stats page
  {path: 'flow', component: FlowMemorizationComponent},  // FLOW memorization tool route
  {path: 'flashcard', component: FlashcardComponent},  // Flashcard memorization tool
];
