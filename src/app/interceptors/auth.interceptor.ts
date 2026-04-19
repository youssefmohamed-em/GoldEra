import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  const token = auth.getToken();

  // ❌ no token → stop request
  if (!token) {
    auth.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('No token'));
  }

  // ❌ expired token → stop request
  if (auth.isTokenExpired(token)) {
    auth.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Expired token'));
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        auth.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};