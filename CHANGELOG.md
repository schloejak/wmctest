# Changelog

## [1.0.1] - 2026-04-06

### Added
- BackendService for API communication
- Generic HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Support for query parameters
- File upload/download capabilities
- ApiResponse interface for standardized responses
- BackendDemoComponent showing usage examples
- Demo route at `/demo` (protected)

### Changed
- Updated home component with link to backend demo

## [1.0.0] - 2026-04-06

### Added
- Initial release
- AuthService with Angular Signals
- Login and Home components
- Functional HTTP interceptor (authInterceptor)
- Functional route guard (authGuard)
- JWT token handling
- LocalStorage persistence
- Automatic token injection in HTTP requests
