import {Injectable, signal} from '@angular/core';
import {HttpService} from './http.service';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _user = signal('')
  private baseUrl = 'http://localhost:3000'
  private static tokenKey: string = "token";
  constructor(private httpClient : HttpClient, private router : Router) {
  }
  login(username: string, password: string) {
    return this.httpClient
      .post<{ token: string }>(`${this.baseUrl}/login`,
        { username: username, password: password })
      .pipe(
        tap(response => {
          localStorage.setItem(AuthService.tokenKey, response.token);
          this._user.set(username);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
    this._user.set('');
    this.router.navigate(['/login']);
  }

  isLoggedIn(){
    return !!localStorage.getItem(AuthService.tokenKey)
  }

  getToken() {
    return localStorage.getItem(AuthService.tokenKey)
  }
}
