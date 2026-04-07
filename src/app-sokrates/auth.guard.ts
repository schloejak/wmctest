import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync, Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private router: Router, private auth:AuthService) {
  }
  canActivate() {
    if (this.auth.isLoggedIn()){
      return true;
    }
    else {
      this.router.navigate(['/login'])
      return false;
    }
  }

}
