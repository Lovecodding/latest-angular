# Authentication System Documentation

## Overview

This Angular application implements a comprehensive, enterprise-level authentication system with JWT token management, auth guards, and HTTP interceptors.

## Features

### 1. **Authentication Service** (`auth.service.ts`)
- User login with email/password
- JWT token management
- Refresh token support
- Token expiration checking
- User session management
- Role-based access control
- Automatic logout on token expiration

### 2. **JWT Interceptor** (`jwt.interceptor.ts`)
- Automatically attaches JWT tokens to HTTP requests
- Handles 401 errors and token refresh
- Prevents multiple refresh token requests
- Supports token refresh flow

### 3. **Auth Guard** (`auth.guard.ts`)
- Protects routes from unauthorized access
- Role-based route protection
- Redirects to login with return URL
- Can be configured per route

### 4. **Login Component**
- Modern Material Design UI
- Form validation
- Password visibility toggle
- Remember me functionality
- Error handling
- Loading states

## Usage

### Login Credentials (Demo)
```
Email: any@email.com
Password: any password (minimum 6 characters)
```

### Protecting Routes

```typescript
const routes: Routes = [
  {
    path: 'users',
    canActivate: [AuthGuard],
    children: [
      { path: 'user-list', component: UserListComponent },
      { path: 'user-detail/:id', component: UserDetailComponent }
    ]
  }
];
```

### Role-Based Protection

```typescript
{
  path: 'admin',
  canActivate: [AuthGuard],
  data: { role: 'admin' },
  component: AdminComponent
}
```

### Using Auth Service

```typescript
constructor(private authService: AuthService) {
  // Subscribe to current user
  this.authService.currentUser$.subscribe(user => {
    console.log('Current user:', user);
  });
}

login() {
  this.authService.login({ email, password }).subscribe({
    next: (response) => console.log('Logged in'),
    error: (error) => console.error('Login failed', error)
  });
}

logout() {
  this.authService.logout();
}

// Check authentication status
const isAuth = this.authService.isAuthenticated();

// Get user role
const role = this.authService.getUserRole();

// Check specific role
const isAdmin = this.authService.hasRole('admin');
```

## Architecture

### Core Structure
```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   ├── models/
│   │   ├── auth.model.ts
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts
│       └── api.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── auth.module.ts
│   └── users/
│       └── ...
└── app.module.ts
```

## Security Features

1. **JWT Token Storage**: Tokens stored in localStorage with expiration checking
2. **Automatic Token Refresh**: Interceptor handles token refresh on 401 errors
3. **Token Expiration**: Validates token expiration before API calls
4. **Secure Routing**: Auth guard prevents unauthorized access
5. **Role-Based Access**: Supports role-based route protection
6. **CSRF Protection**: Can be extended with CSRF token support

## API Integration

Replace the mock login implementation with your actual API:

```typescript
// In auth.service.ts
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials);
}

refreshToken(): Observable<LoginResponse> {
  const refreshToken = this.getRefreshToken();
  return this.http.post<LoginResponse>(`${this.API_URL}/auth/refresh`, { refreshToken });
}
```

## Best Practices

1. **Never store sensitive data in localStorage** in production - consider httpOnly cookies
2. **Always use HTTPS** in production
3. **Implement proper CORS** policies on your backend
4. **Use short-lived access tokens** (15-30 minutes)
5. **Use long-lived refresh tokens** (7-30 days)
6. **Implement token rotation** for refresh tokens
7. **Add rate limiting** to prevent brute force attacks
8. **Log security events** for auditing

## Testing

Mock credentials are provided for demo purposes. In production:
- Implement proper backend authentication
- Use environment-specific API URLs
- Add unit tests for auth service and guards
- Add e2e tests for login flow

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Password reset functionality
- [ ] Account registration
- [ ] Social login (OAuth)
- [ ] Session timeout warning
- [ ] Remember device functionality
- [ ] Audit logging
- [ ] Security headers configuration
