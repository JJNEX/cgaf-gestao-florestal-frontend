import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

/**
 * Functional HTTP interceptor that attaches the Bearer token
 * to all requests targeting /api/v1/admin endpoints.
 * Also handles 401 responses by redirecting to login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  

  const token = authService.getToken();

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((response) => {
        if (response.status === 401 && response.error?.message) {       
          if(response.error.message.includes('expirado')) {
            authService.logout();
            toastService.show(response.error.message, 'info');
          } else {
            toastService.show(response.error.message, 'warning');
          }
        }
        return throwError(() => response);
      })
    );
  }

  return next(req);
};
