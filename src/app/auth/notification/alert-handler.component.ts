// src/app/shared/components/notification/alert-handler.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertModalComponent } from './alert-modal.component';
import {Alert, AlertService} from '../handlers/alert.service';

@Component({
  selector: 'app-alert-handler',
  standalone: true,
  imports: [CommonModule, AlertModalComponent],
  template: `
    <app-alert-modal
      [isVisible]="!!alert"
      [type]="alert?.type || 'info'"
      [title]="alert?.title || 'Alert'"
      [message]="alert?.message || ''"
      [details]="alert?.details || ''"
      [showCancel]="alert?.showCancel || false"
      [showRetry]="alert?.showRetry || false"
      [confirmText]="alert?.confirmText || 'OK'"
      [cancelText]="alert?.cancelText || 'Cancel'"
      [retryText]="alert?.retryText || 'Retry'"
      [showIcon]="alert?.showIcon !== false"
      (confirm)="onConfirm()"
      (cancel)="onCancel()"
      (retry)="onRetry()"
    ></app-alert-modal>
  `
})
export class AlertHandlerComponent implements OnInit, OnDestroy {
  alert: Alert | null = null;
  private subscription: Subscription | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm(): void {
    if (this.alert?.confirmCallback) {
      this.alert.confirmCallback();
    }
    this.alertService.closeAlert();
  }

  onCancel(): void {
    if (this.alert?.cancelCallback) {
      this.alert.cancelCallback();
    }
    this.alertService.closeAlert();
  }

  onRetry(): void {
    if (this.alert?.retryCallback) {
      this.alert.retryCallback();
    }
    this.alertService.closeAlert();
  }
}
