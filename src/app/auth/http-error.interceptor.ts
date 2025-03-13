// src/app/shared/interceptors/http-error.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {ErrorHandlingService} from './auth.service';

export const httpErrorInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const errorService = inject(ErrorHandlingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't redirect for authentication errors (handled by auth guard)
      if (error.status !== 401) {
        // Handle errors except 401 by redirecting to error pages
        errorService.handleHttpError(error);
      }
      return throwError(() => error);
    })
  );
};
