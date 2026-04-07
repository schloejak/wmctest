import {Injectable, signal} from '@angular/core';
import {JwtResponse} from './response-types/jwt-response';
import {map} from 'rxjs';
import moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.baseUrl;
  private readonly _user = signal('');
  readonly user = this._user.asReadonly();

  constructor(private readonly http: HttpClient, private readonly api: ApiService) {
    const storedUser = localStorage.getItem('teachername');
    if (storedUser) {
      this._user.set(storedUser);
    }
  }

  public static readonly tokenKey = 'token';

  login(username: string, password: string) {
    const auth = {
      username: username,
      password: password,
    }
    return this.http
      .post<JwtResponse>(`${this.baseUrl}/token`, auth)
      .pipe(map(response => {
          const expiresAt = moment().add(response.expiresIn, 'second');

          localStorage.setItem('expires-at', JSON.stringify(expiresAt.valueOf()));
          localStorage.setItem(AuthService.tokenKey, response.token);
          localStorage.setItem('teachername', username);
        this._user.set(username);
          this.api.loadSubjects();
        })
      );
  }

  logout() {
    localStorage.removeItem(AuthService.tokenKey);
    localStorage.removeItem('expires-at');
    localStorage.removeItem('teachername');
  }

  public isLoggedIn() {
    if (!localStorage.getItem('expires-at'))
      return false;
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires-at')!;
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
