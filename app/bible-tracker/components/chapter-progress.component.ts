// components/chapter-progress.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BibleBook, ChapterProgress } from '../models';
import { CommonModule } from '@angular/common';
import { VerseSelectorComponent } from './verse-selector.component';
import {ConfirmationModalComponent} from './confirmation-modal';

@Component({
  selector: 'app-chapter-progress',
  standalone: true,
  imports: [
    CommonModule,
    VerseSelectorComponent,
    ConfirmationModalComponent,
    ConfirmationModalComponent
  ],
  template: `
    <div *ngIf="currentBook && selectedChapterIndex >= 0 && selectedChapterIndex < currentBook.chapters.length"
         class="bg-white border rounded p-4 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">
          {{ currentBook.bookName }} {{ selectedChapter }}
          <span *ngIf="chapterProgress?.completed" class="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            Completed
          </span>
          <span *ngIf="!chapterProgress?.completed && chapterProgress?.inProgress"
                class="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            In Progress
          </span>
        </h3>
        <span class="text-gray-600">
          {{ memorizedCount }} / {{ totalVerses }} verses
        </span>
      </div>

      <!-- Progress Details -->
      <div class="mb-4">
        <div class="flex flex-col space-y-1">
          <p class="text-sm text-gray-600">Total verses: {{ totalVerses }}</p>
          <p class="text-sm text-gray-600">Memorized: {{ memorizedCount }}</p>
          <p class="text-sm text-gray-600">
            Remaining: {{ totalVerses - memorizedCount }}
          </p>
          <p class="text-sm text-gray-600">
            Progress: {{ progressPercent }}%
          </p>
        </div>
      </div>

      <!-- Verse Selector Component -->
      <app-verse-selector
        [totalVerses]="totalVerses"
        [versesMemorized]="chapterProgress?.versesMemorized || []"
        (versesChange)="onVersesChange($event)"
      ></app-verse-selector>
    </div>

    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [isVisible]="isConfirmModalVisible"
      [title]="'Reset Chapter'"
      [message]="'Are you sure you want to reset progress for Chapter ' + selectedChapter + '? This action cannot be undone.'"
      [confirmText]="'Reset'"
      (confirm)="confirmReset()"
      (cancel)="cancelReset()"
    ></app-confirmation-modal>
  `,
  styles: [`
    .action-button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .action-button.primary {
      background-color: rgba(59, 130, 246, 1);
      color: white;
    }

    .action-button.primary:hover {
      background-color: rgba(37, 99, 235, 1);
    }

    .action-button.secondary {
      background-color: rgba(156, 163, 175, 1);
      color: white;
    }

    .action-button.secondary:hover {
      background-color: rgba(107, 114, 128, 1);
    }

    .action-button.danger {
      background-color: rgba(239, 68, 68, 1);
      color: white;
    }

    .action-button.danger:hover {
      background-color: rgba(220, 38, 38, 1);
    }

    .mr-2 {
      margin-right: 0.5rem;
    }
  `]
})
export class ChapterProgressComponent {
  @Input() currentBook: BibleBook | null = null;
  @Input() selectedChapter: number = 1;
  @Input() selectedChapterIndex: number = 0;
  @Input() chapterProgress: ChapterProgress | null = null;

  @Output() incrementVersesEvent = new EventEmitter<void>();
  @Output() decrementVersesEvent = new EventEmitter<void>();
  @Output() updateProgress = new EventEmitter<number[]>();
  @Output() resetChapter = new EventEmitter<void>();

  isConfirmModalVisible: boolean = false;

  get totalVerses(): number {
    if (!this.currentBook || this.selectedChapterIndex < 0 || this.selectedChapterIndex >= this.currentBook.chapters.length) {
      return 0;
    }
    return this.currentBook.chapters[this.selectedChapterIndex];
  }

  get memorizedCount(): number {
    return this.chapterProgress?.versesMemorized?.filter(v => v).length || 0;
  }

  get progressPercent(): number {
    if (!this.totalVerses) return 0;
    return Math.round((this.memorizedCount / this.totalVerses) * 100);
  }

  incrementVerses(): void {
    this.incrementVersesEvent.emit();
  }

  decrementVerses(): void {
    this.decrementVersesEvent.emit();
  }

  onVersesChange(versesMemorized: boolean[]): void {
    // Convert boolean array to list of verse numbers for API compatibility
    const selectedVerses = versesMemorized
      .map((isMemorized, index) => isMemorized ? index + 1 : null)
      .filter(v => v !== null) as number[];

    this.updateProgress.emit(selectedVerses);
  }

  showConfirmModal(): void {
    this.isConfirmModalVisible = true;
  }

  confirmReset(): void {
    this.resetChapter.emit();
    this.isConfirmModalVisible = false;
  }

  cancelReset(): void {
    this.isConfirmModalVisible = false;
  }
}
