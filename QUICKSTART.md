# Quick Start Guide

## For Package Users

### Installation
```bash
npm install @yourusername/angular-auth-template
```

### Minimal Setup (3 Steps)

#### 1. Configure App (`app.config.ts`)
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

#### 2. Setup Routes (`app.routes.ts`)
```typescript
import { Routes } from '@angular/router';
import { authGuard, LoginComponent, HomeComponent } from '@yourusername/angular-auth-template';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
```

#### 3. Initialize Auth (`app.ts`)
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
    this.authService.baseUrl = 'http://localhost:3000/api'; // Your API URL
    this.authService.initAuth();
  }
}
```

Done! Your app now has:
- ✅ Login page at `/login`
- ✅ Protected home page at `/`
- ✅ Automatic JWT token handling
- ✅ Auth state with Signals

---

## For Developers (Working on this package)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run dev server**
   ```bash
   npm start
   ```
   Open http://localhost:4200

3. **Build for production**
   ```bash
   npm run build
   ```

### Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── auth.service.ts         # ⭐ Core auth logic
│   │   └── auth.interceptor.ts     # ⭐ JWT interceptor
│   ├── guards/
│   │   └── auth.guard.ts           # ⭐ Route protection
│   ├── login/
│   │   └── login.component.ts      # Login UI
│   ├── home/
│   │   └── home.component.ts       # Protected page example
│   └── app.routes.ts               # Route config
└── public-api.ts                    # ⭐ Package exports
```

### Customization

**Change login logic:**
Edit `src/app/login/login.component.ts`

**Change auth flow:**
Edit `src/app/auth/auth.service.ts`

**Change protected page:**
Edit `src/app/home/home.component.ts`

### Build for npm

```bash
npm run build:lib
```

Outputs to `dist/` folder with:
- Compiled JavaScript
- TypeScript declarations
- Source maps

### Publishing

See [PUBLISHING.md](PUBLISHING.md) for detailed instructions.

Quick version:
```bash
npm run build:lib
npm login
npm publish --access public
```

### Testing Backend Integration

Your backend needs:

**Endpoint:** `POST /api/token`

**Request:**
```json
{
  "username": "testuser",
  "password": "testpass"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `npm start` |
| Build app | `npm run build` |
| Build library | `npm run build:lib` |
| Run tests | `npm test` |
| Format code | `npx prettier --write .` |

### Key Features

✨ **Angular Signals** - Modern reactive state
```typescript
authService.user() // Get current user
```

🛡️ **Functional Guards** - No classes needed
```typescript
export const authGuard: CanActivateFn = () => { ... }
```

🔌 **Functional Interceptors** - Clean HTTP interception
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }
```

### File Overview

| File | Purpose |
|------|---------|
| `auth.service.ts` | Login/logout, token management, user state |
| `auth.interceptor.ts` | Adds JWT to HTTP requests |
| `auth.guard.ts` | Protects routes from unauthorized access |
| `login.component.ts` | Login form UI |
| `public-api.ts` | What gets exported to npm |

### Need Help?

- 📖 [README.md](README.md) - Full documentation
- 🚀 [USAGE.md](USAGE.md) - Advanced usage examples
- 📦 [PUBLISHING.md](PUBLISHING.md) - Publishing guide
- 📝 [CHANGELOG.md](CHANGELOG.md) - Version history

### License

MIT - Free to use and modify!
