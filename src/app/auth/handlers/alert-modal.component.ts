// src/app/shared/components/notification/error-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="modal-backdrop">
      <div class="modal-container error-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
        </div>
        <div class="modal-body">
          <div class="error-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p class="error-message">{{ message }}</p>
          <p *ngIf="details" class="error-details">{{ details }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" (click)="onClose()">{{ closeText }}</button>
          <button *ngIf="showRetry" class="btn btn-secondary" (click)="onRetry()">{{ retryText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      width: 90%;
      max-width: 500px;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    .error-modal {
      border-top: 4px solid #e53e3e;
    }

    .modal-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
    }

    .modal-body {
      padding: 1.5rem;
      color: #4a5568;
      font-size: 1rem;
      text-align: center;
    }

    .error-icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .error-icon {
      width: 3.5rem;
      height: 3.5rem;
      color: #e53e3e;
    }

    .error-message {
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      color: #2d3748;
    }

    .error-details {
      font-size: 0.875rem;
      color: #718096;
      background-color: #f7fafc;
      padding: 0.75rem;
      border-radius: 0.375rem;
      margin-top: 1rem;
      text-align: left;
      white-space: pre-wrap;
      overflow-x: auto;
    }

    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      font-size: 0.875rem;
    }

    .btn-primary {
      background-color: #e53e3e;
      color: white;
    }

    .btn-primary:hover {
      background-color: #c53030;
    }

    .btn-secondary {
      background-color: #edf2f7;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background-color: #e2e8f0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class ErrorModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Error';
  @Input() message: string = 'An error occurred while processing your request.';
  @Input() details: string = '';
  @Input() closeText: string = 'Close';
  @Input() retryText: string = 'Retry';
  @Input() showRetry: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}
