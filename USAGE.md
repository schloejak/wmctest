# Angular Auth Template - Usage Guide

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── auth.service.ts        # Core authentication service with Signals
│   │   └── auth.interceptor.ts    # HTTP interceptor for JWT
│   ├── guards/
│   │   └── auth.guard.ts          # Route guard for protected routes
│   ├── login/
│   │   └── login.component.ts     # Login page component
│   ├── home/
│   │   └── home.component.ts      # Protected home page
│   ├── app.config.ts              # App configuration
│   ├── app.routes.ts              # Route definitions
│   └── app.ts                     # Root component
├── public-api.ts                  # Public exports for npm package
└── main.ts
```

## Key Features Explained

### 1. AuthService with Signals

The AuthService uses Angular Signals for reactive state management:

```typescript
private _user = signal<string>('');
public readonly user = this._user.asReadonly();
```

Benefits:
- Fine-grained reactivity
- Better performance than traditional observables for simple state
- Cleaner syntax in templates: `{{ authService.user() }}`

### 2. Functional HTTP Interceptor

Modern functional interceptor (no classes needed):

```typescript
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
```

### 3. Functional Route Guard

Modern functional guard (no classes needed):

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
```

## Backend Integration

### Required Endpoint

Your backend should provide a token endpoint:

**POST** `/api/token`

Request:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Format

The JWT token should contain user information in the payload:

```json
{
  "sub": "username",
  "username": "user@example.com",
  "exp": 1735689600
}
```

## Customization Examples

### Custom Login Component

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  template: `
    <form (submit)="login()">
      <input [(ngModel)]="username" placeholder="Username" />
      <input [(ngModel)]="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `
})
export class CustomLoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  username = '';
  password = '';
  
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error(err)
    });
  }
}
```

### Using the User Signal

```typescript
import { Component, inject, effect } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  template: `
    <div>
      @if (authService.user()) {
        <p>Welcome, {{ authService.user() }}!</p>
      } @else {
        <p>Please log in</p>
      }
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  
  constructor() {
    // React to user changes
    effect(() => {
      console.log('User changed:', this.authService.user());
    });
  }
}
```

### Configuring API Base URL

In your app initialization:

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        authService.baseUrl = 'https://api.example.com';
        authService.initAuth();
      },
      deps: [AuthService],
      multi: true
    }
  ]
};
```

## Testing

### Mock AuthService

```typescript
import { signal } from '@angular/core';

const mockAuthService = {
  user: signal('testuser'),
  login: jasmine.createSpy('login'),
  logout: jasmine.createSpy('logout'),
  isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true),
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token'),
  initAuth: jasmine.createSpy('initAuth')
};
```

## Advanced Usage

### Remember Me Functionality

Extend the service to use sessionStorage for temporary sessions:

```typescript
login(username: string, password: string, rememberMe: boolean = false) {
  const storage = rememberMe ? localStorage : sessionStorage;
  return this.httpClient
    .post<{ token: string }>(`${this.baseUrl}/token`, { username, password })
    .pipe(
      tap(response => {
        storage.setItem(AuthService.tokenKey, response.token);
        this._user.set(username);
      })
    );
}
```

### Token Refresh

Add automatic token refresh:

```typescript
refreshToken() {
  return this.httpClient
    .post<{ token: string }>(`${this.baseUrl}/refresh`, {})
    .pipe(
      tap(response => {
        localStorage.setItem(AuthService.tokenKey, response.token);
      })
    );
}
```

## Deployment

### Building for Production

```bash
# Build the Angular app
npm run build

# Build the library for npm
npm run build:lib
```

### Publishing to npm

```bash
# Login to npm
npm login

# Publish (first time)
npm publish --access public

# Update version and publish
npm version patch
npm publish
```

## Troubleshooting

### Issue: "No provider for HttpClient"

Solution: Make sure you've added `provideHttpClient()` in your app.config.ts

### Issue: "Login redirects but user is empty"

Solution: Call `authService.initAuth()` in your app component's `ngOnInit()`

### Issue: "Interceptor not working"

Solution: Ensure `authInterceptor` is registered in `provideHttpClient(withInterceptors([authInterceptor]))`
