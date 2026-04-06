# Angular Authentication Template

A minimalist Angular authentication template using modern Angular features including **Signals**, functional guards, and functional HTTP interceptors.

## Features

- ✨ **Angular Signals** for reactive state management
- 🔐 **JWT Token Authentication** with automatic token handling
- 🛡️ **HTTP Interceptor** for automatic Authorization header injection
- 🚦 **Route Guards** using functional guards (CanActivateFn)
- 📦 **Standalone Components** - no modules required
- 🎨 **Minimal & Clean** - ready to customize

## Installation

```bash
npm install @yourusername/angular-auth-template
```

## Quick Start

### 1. Configure Your App

In your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@yourusername/angular-auth-template';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
```

### 2. Set Up Routes

In your `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { authGuard, LoginComponent, HomeComponent } from '@yourusername/angular-auth-template';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
```

### 3. Initialize Auth Service

In your root component (`app.ts`):

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@yourusername/angular-auth-template';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.initAuth();
  }
}
```

## API

### AuthService

```typescript
class AuthService {
  // Observable user signal
  readonly user: Signal<string>;
  
  // Set your API base URL
  baseUrl: string;
  
  // Login method
  login(username: string, password: string): Observable<{ token: string }>;
  
  // Logout method
  logout(): void;
  
  // Check authentication status
  isLoggedIn(): boolean;
  
  // Get stored token
  getToken(): string | null;
  
  // Initialize auth from localStorage
  initAuth(): void;
}
```

### Usage Example

```typescript
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@yourusername/angular-auth-template';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      <p>Logged in as: {{ authService.user() }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  
  logout() {
    this.authService.logout();
  }
}
```

## Configuration

Set your API base URL in the AuthService:

```typescript
import { AuthService } from '@yourusername/angular-auth-template';

const authService = inject(AuthService);
authService.baseUrl = 'https://your-api.com/api';
```

## Expected Backend Response

The login endpoint should return:

```json
{
  "token": "your-jwt-token"
}
```

## Components Included

- **LoginComponent** - Ready-to-use login form with error handling
- **HomeComponent** - Example protected home page
- **authGuard** - Functional route guard
- **authInterceptor** - Functional HTTP interceptor

## Customization

All components are standalone and can be easily customized. Simply copy the components to your project and modify as needed.

## Development

Run the demo app:

```bash
npm start
```

Build the library:

```bash
npm run build:lib
```

## Publishing to npm

1. Update `package.json` with your details:
   - Change `@yourusername/angular-auth-template` to your package name
   - Update author, repository URL, etc.

2. Build the library:
   ```bash
   npm run build:lib
   ```

3. Login to npm:
   ```bash
   npm login
   ```

4. Publish:
   ```bash
   npm publish --access public
   ```

## License

MIT
