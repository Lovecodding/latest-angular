# Authentication System Documentation

## Overview

This Angular application implements a simple authentication system with JWT token management, auth guards, and HTTP interceptors.

## Features

### 1. **Authentication Service** (`auth.service.ts`)
- User login with email/password
- JWT token storage in localStorage
- Basic authentication checking
- Logout functionality

### 2. **JWT Interceptor** (`jwt.interceptor.ts`)
- Automatically attaches JWT tokens to HTTP requests

### 3. **Auth Guard** (`auth.guard.ts`)
- Protects routes from unauthorized access
- Redirects to login page if not authenticated

### 4. **Login Component**
- Simple form with email and password
- Form validation
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

### Using Auth Service

```typescript
constructor(private authService: AuthService) {}

// Login
login() {
  this.authService.login({ email, password }).subscribe({
    next: () => console.log('Logged in'),
    error: (error) => console.error('Login failed', error)
  });
}

// Logout
logout() {
  this.authService.logout();
}

// Check if authenticated
const isAuth = this.authService.isAuthenticated();
```

## Architecture

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   ├── models/
│   │   └── auth.model.ts
│   └── services/
│       └── auth.service.ts
├── features/
│   └── auth/
│       └── login/
│           ├── login.component.ts
│           ├── login.component.html
│           └── login.component.scss
```

## API Integration

Replace the mock login with your actual API:

```typescript
// In auth.service.ts
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials);
}
```

