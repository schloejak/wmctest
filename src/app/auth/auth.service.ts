import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly tokenKey = 'auth_token';
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  
  private _user = signal<string>('');
  public readonly user = this._user.asReadonly();
  
  baseUrl = 'http://localhost:3000/api';

  login(username: string, password: string) {
    return this.httpClient
      .post<{ token: string }>(`${this.baseUrl}/token`, 
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

  getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  initAuth(): void {
    const token = this.getToken();
    if (token) {
      const username = this.getUsernameFromToken(token);
      this._user.set(username);
    }
  }

  private getUsernameFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.username || '';
    } catch {
      return '';
    }
  }
}
