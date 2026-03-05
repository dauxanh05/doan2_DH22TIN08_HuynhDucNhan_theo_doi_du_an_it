# Branch 02: Auth Frontend

## Scope

Implement frontend cho Authentication & User module. Backend đã hoàn thành trên branch 01.

## Dependencies từ Backend

### API Endpoints đã có (apps/api/)
```
POST   /api/auth/register         → { user }
POST   /api/auth/login            → { accessToken, refreshToken, user }
POST   /api/auth/logout           → { message }
POST   /api/auth/refresh          → { accessToken, refreshToken, user }
GET    /api/auth/google           → redirect Google OAuth
GET    /api/auth/google/callback  → redirect FE + set cookie
POST   /api/auth/forgot-password  → { message }
POST   /api/auth/reset-password   → { message }
GET    /api/auth/verify-email/:token → { message }

GET    /api/users/me              → { user }
PATCH  /api/users/me              → { user }
PATCH  /api/users/me/password     → { message }
POST   /api/users/me/avatar       → { user } (multipart/form-data)
```

### Response Types
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  provider: 'LOCAL' | 'GOOGLE';
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

### Auth Flow
- Access token: JWT, 15 phút, gửi trong `Authorization: Bearer <token>`
- Refresh token: HTTP-only cookie (7 ngày), browser tự gửi
- Token rotation: mỗi lần refresh, token cũ bị revoke

## Files cần tạo

### Core
- `src/services/api.ts` — Axios instance + interceptor (auto refresh token)
- `src/stores/auth.store.ts` — Zustand store (user, isAuthenticated, login, logout)
- `src/components/ProtectedRoute.tsx` — Redirect to /login nếu chưa auth

### Pages
- `src/features/auth/pages/LoginPage.tsx` — Form email/password + Google button
- `src/features/auth/pages/RegisterPage.tsx` — Form name, email, password
- `src/features/auth/pages/ForgotPasswordPage.tsx` — Form email
- `src/features/auth/pages/ResetPasswordPage.tsx` — Form new password
- `src/features/auth/pages/VerifyEmailPage.tsx` — Auto verify khi access

### Components
- `src/features/auth/components/AuthLayout.tsx` — Layout chung cho auth pages
- `src/features/auth/components/LoginForm.tsx` — Form component
- `src/features/auth/components/RegisterForm.tsx` — Form component
- `src/features/auth/components/GoogleLoginButton.tsx` — OAuth button

### Hooks (TanStack Query)
- `src/hooks/useLogin.ts` — mutation login
- `src/hooks/useRegister.ts` — mutation register
- `src/hooks/useCurrentUser.ts` — query GET /users/me
- `src/hooks/useForgotPassword.ts` — mutation
- `src/hooks/useResetPassword.ts` — mutation

### Router
- Cập nhật router: thêm routes cho auth pages + protected routes

## Existing Frontend Code

Cần đọc trước khi code:
- `apps/web/src/main.tsx` — entry point
- `apps/web/src/App.tsx` — root component
- `apps/web/src/stores/` — existing stores (nếu có)
- `apps/web/vite.config.ts` — path aliases
- `apps/web/package.json` — dependencies đã cài

## Branch Info
- Branch: `02-feat-auth-fe`
- Base: `main`
- Started: 2026-03-05

---

*Created: 2026-03-05*
