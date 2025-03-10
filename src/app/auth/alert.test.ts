// Create a simple test component
import {Component} from '@angular/core';
import {AlertService} from './handlers/alert.service';

@Component({
  selector: 'app-alert-test',
  template: `
    <div class="container p-4">
      <h2>Alert System Test</h2>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <button (click)="showInfoAlert()" class="btn bg-blue-500 text-white p-2 rounded">Test Info Alert</button>
        <button (click)="showSuccessAlert()" class="btn bg-green-500 text-white p-2 rounded">Test Success Alert</button>
        <button (click)="showWarningAlert()" class="btn bg-yellow-500 text-white p-2 rounded">Test Warning Alert</button>
        <button (click)="showErrorAlert()" class="btn bg-red-500 text-white p-2 rounded">Test Error Alert</button>
        <button (click)="showConfirmationDialog()" class="btn bg-purple-500 text-white p-2 rounded">Test Confirmation</button>
        <button (click)="showCustomAlert()" class="btn bg-gray-500 text-white p-2 rounded">Test Custom Alert</button>
      </div>
    </div>
  `
})
export class AlertTestComponent {
  constructor(private alertService: AlertService) {}

  showInfoAlert(): void {
    this.alertService.showInfo('This is an information message');
  }

  showSuccessAlert(): void {
    this.alertService.showSuccess('Operation completed successfully!');
  }

  showWarningAlert(): void {
    this.alertService.showWarning('Warning: This action cannot be undone');
  }

  showErrorAlert(): void {
    this.alertService.showError('An error occurred while processing your request');
  }

  showConfirmationDialog(): void {
    this.alertService.showConfirmation(
      'Are you sure you want to proceed?',
      'Confirm Action',
      () => console.log('User confirmed the action'),
      () => console.log('User cancelled the action')
    );
  }

  showCustomAlert(): void {
    this.alertService.showAlert({
      type: 'info',
      title: 'Custom Alert',
      message: 'This is a custom alert with details',
      details: 'Additional details can be shown here.\nAnd can span multiple lines.',
      showCancel: true,
      showRetry: true,
      confirmText: 'Continue',
      cancelText: 'Back',
      retryText: 'Try Again',
      confirmCallback: () => console.log('Confirm clicked'),
      cancelCallback: () => console.log('Cancel clicked'),
      retryCallback: () => console.log('Retry clicked')
    });
  }
}
