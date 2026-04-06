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

## BackendService (NEW in v1.0.1)

Generic HTTP service for backend communication with automatic JWT authentication.

### Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { BackendService } from '@yourusername/angular-auth-template';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  template: `
    @for (user of users(); track user.id) {
      <div>{{ user.name }}</div>
    }
  `
})
export class UsersComponent {
  backendService = inject(BackendService);
  users = signal<User[]>([]);

  ngOnInit() {
    // GET request with automatic JWT token
    this.backendService.get<User[]>('/users').subscribe(
      users => this.users.set(users)
    );
  }
}
```

### Available Methods

```typescript
// GET request
backendService.get<T>(endpoint: string, params?: Record<string, string | number>)

// POST request
backendService.post<T>(endpoint: string, body: any)

// PUT request
backendService.put<T>(endpoint: string, body: any)

// PATCH request
backendService.patch<T>(endpoint: string, body: any)

// DELETE request
backendService.delete<T>(endpoint: string)

// GET with standardized response
backendService.getWithResponse<T>(endpoint: string, params?)

// POST with standardized response
backendService.postWithResponse<T>(endpoint: string, body: any)

// Upload file
backendService.uploadFile<T>(endpoint: string, file: File, additionalData?)

// Download file
backendService.downloadFile(endpoint: string): Observable<Blob>
```

### Examples

**With Query Parameters:**
```typescript
backendService.get<User[]>('/users', { page: 1, limit: 10 }).subscribe();
```

**Create Resource:**
```typescript
const newUser = { name: 'John', email: 'john@example.com' };
backendService.post<User>('/users', newUser).subscribe();
```

**Update Resource:**
```typescript
const updates = { name: 'Jane' };
backendService.put<User>('/users/123', updates).subscribe();
```

**Delete Resource:**
```typescript
backendService.delete<void>('/users/123').subscribe();
```

**File Upload:**
```typescript
const file = event.target.files[0];
backendService.uploadFile('/upload', file, { category: 'profile' }).subscribe();
```

**File Download:**
```typescript
backendService.downloadFile('/export/users').subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users.csv';
  a.click();
});
```

### ApiResponse Interface

For standardized API responses:

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Usage
backendService.getWithResponse<User[]>('/users').subscribe(response => {
  if (response.success) {
    console.log(response.data);
    console.log(response.message);
  }
});
```

### Configuration

Set your API base URL:

```typescript
ngOnInit() {
  this.backendService.baseUrl = 'https://api.example.com';
}
```

**Note:** All requests automatically include the JWT token via `authInterceptor`.

