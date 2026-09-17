import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - session expired or invalid credentials
        if (!req.url.includes('/login') && !req.url.includes('/signup')) {
          toast.error('Session expired. Please sign in again.');
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.status === 0) {
        toast.error('Unable to connect to server. Please check your connection.');
      } else if (error.status >= 500) {
        const msg = error.error?.message || 'A server error occurred. Please try again later.';
        toast.error(msg);
      }

      return throwError(() => error);
    })
  );
};
