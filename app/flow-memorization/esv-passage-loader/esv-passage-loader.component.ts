// src/app/flow-memorization/esv-passage-loader/esv-passage-loader.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EsvApiService, ESVPassageOptions, PassageData } from '../../services/esv-api.service';

@Component({
  selector: 'app-esv-passage-loader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="esv-passage-loader">
      <h3 class="text-lg font-semibold mb-2">Load ESV Passage</h3>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block mb-2 font-medium">Book Title:</label>
          <input
            type="text"
            [(ngModel)]="bookTitle"
            placeholder="e.g., Psalms, John, Matthew"
            class="w-full p-2 border rounded"
            [disabled]="isLoading"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium">Chapter/Verse:</label>
          <input
            type="text"
            [(ngModel)]="chapterVerse"
            placeholder="e.g., 1, 3:16, 5:1-10"
            class="w-full p-2 border rounded"
            [disabled]="isLoading"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mb-4">
        <div>
          <label class="flex items-center space-x-2">
            <input type="checkbox" [(ngModel)]="includeVerseNumbers" />
            <span>Include verse numbers</span>
          </label>
        </div>

        <div>
          <select [(ngModel)]="selectedPreset" class="p-2 border rounded">
            <option value="default">Default Format</option>
            <option value="memorization">For Memorization</option>
            <option value="study">For Study</option>
            <option value="reading">For Reading</option>
          </select>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          (click)="loadPassage()"
          [disabled]="isLoading || !isValidReference()"
          class="px-4 py-2 rounded font-medium"
          [ngClass]="{'bg-blue-500 hover:bg-blue-600 text-white': !isLoading && isValidReference(),
                      'bg-gray-300 text-gray-500': isLoading || !isValidReference()}"
        >
          {{ isLoading ? 'Loading...' : 'Load to Text Area' }}
        </button>
      </div>

      <div *ngIf="error" class="mt-3 p-3 bg-red-100 text-red-800 rounded">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .esv-passage-loader {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: #f9fafb;
    }
  `]
})
export class EsvPassageLoaderComponent {
  @Input() apiKey: string = '';
  @Output() passageLoaded = new EventEmitter<PassageData>();

  bookTitle: string = '';
  chapterVerse: string = '';
  includeVerseNumbers: boolean = true;
  selectedPreset: string = 'default';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private esvApiService: EsvApiService) {}

  loadPassage(): void {
    if (!this.isValidReference()) {
      this.error = 'Please enter both book title and chapter/verse';
      return;
    }

    if (!this.apiKey) {
      this.error = 'ESV API key is not configured';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Set the API key
    this.esvApiService.setApiKey(this.apiKey);

    // Construct the passage reference
    const passageRef = `${this.bookTitle} ${this.chapterVerse}`;

    // Get options based on selected preset
    const options = this.getOptionsForPreset();

    // Fetch the passage
    this.esvApiService.fetchPassage(passageRef, options).subscribe({
      next: (response) => {
        const processedData = this.esvApiService.processPassageForMemorization(response);
        this.passageLoaded.emit(processedData);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = `Failed to load passage: ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  isValidReference(): boolean {
    return !!(this.bookTitle && this.chapterVerse);
  }

  private getOptionsForPreset(): ESVPassageOptions {
    const presets = this.esvApiService.getPresets();
      switch (this.selectedPreset) {
      case 'memorization':
        return presets["memorization"]
      case 'study':
        return presets["study"]
      case 'reading':
        return presets["reading"];
      default:
        // Override default with verse numbers setting
        return {
          'include-verse-numbers': this.includeVerseNumbers,
          'include-first-verse-numbers': this.includeVerseNumbers
        };
    }
  }
}
