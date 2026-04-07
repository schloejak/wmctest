# ✅ Successfully Published to npm!

## Package Information

**Package Name:** `@ichgamer999/wmctest`
**Version:** `1.0.2`
**Published:** 2026-04-06

## What's Included

### Core Features

1. **AuthService** (with Signals)
   - JWT authentication
   - Login/Logout functions
   - User state management
   - Token handling

2. **BackendService** (with Signals) ⭐ NEW
   - Global `loading` signal
   - Global `error` signal
   - HTTP methods: GET, POST, PUT, PATCH, DELETE
   - Query parameters support
   - File upload/download
   - Automatic JWT token injection

3. **Components**
   - LoginComponent - Ready-to-use login form
   - HomeComponent - Protected home page
   - BackendDemoComponent - Interactive API demo

4. **Guards & Interceptors**
   - authGuard - Functional route guard
   - authInterceptor - Functional HTTP interceptor

## Installation

```bash
npm install @ichgamer999/wmctest
```

## Quick Usage

```typescript
import { BackendService } from '@ichgamer999/wmctest';

// In your component
backendService = inject(BackendService);

// Check loading state
@if (backendService.loading()) {
  <div>Loading...</div>
}

// Check errors
@if (backendService.error()) {
  <div>Error: {{ backendService.error() }}</div>
}

// Make API calls
this.backendService.get<User[]>('/users').subscribe(users => {
  console.log(users);
});
```

## Published Files

- ✅ Compiled JavaScript
- ✅ TypeScript declarations
- ✅ Source maps
- ✅ README documentation
- ✅ LICENSE (MIT)

## Links

- **npm Package:** https://www.npmjs.com/package/@ichgamer999/wmctest
- **GitHub Repository:** https://github.com/schloejak/wmctest
- **Git Tag:** v1.0.2

## Version History

- **v1.0.2** - Added Signals to BackendService (current)
- **v1.0.1** - Added BackendService
- **v1.0.0** - Initial release with AuthService

## Next Steps

Users can now install with:
```bash
npm install @ichgamer999/wmctest@1.0.2
```

Or for latest:
```bash
npm install @ichgamer999/wmctest
```

---

**Status:** 🎉 Live on npm!
**Bundle Size:** 13.8 KB
**Total Files:** 46
