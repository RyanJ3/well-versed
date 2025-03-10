// src/app/shared/components/notification/alert-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="modal-backdrop">
      <div class="modal-container" [ngClass]="'alert-type-' + type">
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
        </div>
        <div class="modal-body">
          <div class="alert-icon-container" *ngIf="showIcon">
            <!-- Success Icon -->
            <svg *ngIf="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>

            <!-- Info Icon -->
            <svg *ngIf="type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>

            <!-- Warning Icon -->
            <svg *ngIf="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>

            <!-- Error/Danger Icon -->
            <svg *ngIf="type === 'danger'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p class="alert-message">{{ message }}</p>
          <p *ngIf="details" class="alert-details">{{ details }}</p>
        </div>
        <div class="modal-footer">
          <button
            *ngIf="showCancel"
            class="btn btn-secondary"
            (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button
            class="btn"
            [ngClass]="'btn-' + type"
            (click)="onConfirm()">
            {{ confirmText }}
          </button>
          <button
            *ngIf="showRetry"
            class="btn btn-secondary"
            (click)="onRetry()">
            {{ retryText }}
          </button>
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

    .modal-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .alert-type-info .modal-header {
      border-top: 4px solid #3b82f6;
      background-color: #eff6ff;
    }

    .alert-type-success .modal-header {
      border-top: 4px solid #10b981;
      background-color: #ecfdf5;
    }

    .alert-type-warning .modal-header {
      border-top: 4px solid #f59e0b;
      background-color: #fffbeb;
    }

    .alert-type-danger .modal-header {
      border-top: 4px solid #ef4444;
      background-color: #fee2e2;
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

    .alert-icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .alert-icon {
      width: 3.5rem;
      height: 3.5rem;
    }

    .alert-type-info .alert-icon {
      color: #3b82f6;
    }

    .alert-type-success .alert-icon {
      color: #10b981;
    }

    .alert-type-warning .alert-icon {
      color: #f59e0b;
    }

    .alert-type-danger .alert-icon {
      color: #ef4444;
    }

    .alert-message {
      font-size: 1.125rem;
      margin-bottom: 0.75rem;
      color: #2d3748;
    }

    .alert-details {
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

    .btn-info {
      background-color: #3b82f6;
      color: white;
    }

    .btn-info:hover {
      background-color: #2563eb;
    }

    .btn-success {
      background-color: #10b981;
      color: white;
    }

    .btn-success:hover {
      background-color: #059669;
    }

    .btn-warning {
      background-color: #f59e0b;
      color: white;
    }

    .btn-warning:hover {
      background-color: #d97706;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background-color: #dc2626;
    }

    .btn-secondary {
      background-color: #e2e8f0;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background-color: #cbd5e0;
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
export class AlertModalComponent {
  @Input() isVisible: boolean = false;
  @Input() type: AlertType = 'info';
  @Input() title: string = 'Message';
  @Input() message: string = '';
  @Input() details: string = '';
  @Input() confirmText: string = 'OK';
  @Input() cancelText: string = 'Cancel';
  @Input() retryText: string = 'Retry';
  @Input() showIcon: boolean = true;
  @Input() showCancel: boolean = false;
  @Input() showRetry: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}
