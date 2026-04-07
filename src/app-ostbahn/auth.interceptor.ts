import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (!authService.isLoggedIn())
    return next(req);
  const cloned = req.clone({
    headers: req.headers.set('Authorization',
      `Bearer ${authService.getToken()}`)
  });
  return next(cloned);
};
