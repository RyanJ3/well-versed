// src/app/shared/components/error-handler/error-handler.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ErrorModalComponent } from './alert-modal.component';
import {ErrorHandlerService} from './error-handler.service';

@Component({
  selector: 'app-error-handler',
  standalone: true,
  imports: [CommonModule, ErrorModalComponent],
  template: `
    <app-error-modal
      [isVisible]="!!error"
      [title]="error?.title || 'Error'"
      [message]="error?.message || 'An error occurred.'"
      [details]="error?.details || ''"
      [showRetry]="!!error?.showRetry"
      (close)="onCloseError()"
      (retry)="onRetry()"
    ></app-error-modal>
  `
})
export class ErrorHandlerComponent implements OnInit, OnDestroy {
  error: any = null;
  private subscription: Subscription | null = null;

  constructor(private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    this.subscription = this.errorHandlerService.error$.subscribe(error => {
      this.error = error;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCloseError(): void {
    this.errorHandlerService.closeErrorModal();
  }

  onRetry(): void {
    if (this.error?.retryCallback) {
      this.error.retryCallback();
    }
    this.errorHandlerService.closeErrorModal();
  }
}
