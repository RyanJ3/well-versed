// src/app/memorization/flashcards/flashcards.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashcardService } from './flashcard.service';
import {FlashcardComponent} from './flashcard.component';

@NgModule({
  declarations: [],  // Empty because FlashcardsComponent is standalone
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlashcardComponent  // Import the standalone component
  ],
  exports: [
    FlashcardComponent  // Export it so other modules can use it
  ],
  providers: [
    FlashcardService  // Provide the service at the module level
  ]
})
export class FlashcardModule { }
