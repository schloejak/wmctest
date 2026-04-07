import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (authService.isLoggedOut())
    return next(req);

  const token = localStorage.getItem(AuthService.tokenKey);
  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(cloned);
};
