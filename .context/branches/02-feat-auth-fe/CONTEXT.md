# 02-feat-auth-fe - Context

> **Loai:** feat | **Phu thuoc:** 01-feat-auth-be

## Reference
- `context/01-auth-user.md` - Frontend pages, state management
- `context/overview.md` - Frontend tech stack

## Scope

Toan bo frontend cho authentication va user profile.

### Pages
- **LoginPage** (`/login`) - Form email/password + nut Google login
- **RegisterPage** (`/register`) - Form name, email, password
- **ForgotPasswordPage** (`/forgot-password`) - Nhap email gui link reset
- **ResetPasswordPage** (`/reset-password/:token`) - Nhap password moi
- **VerifyEmailPage** (`/verify-email/:token`) - Tu dong verify khi truy cap
- **ProfilePage** (`/settings/profile`) - Xem/sua name, avatar, theme
- **ChangePasswordPage** (`/settings/password`) - Doi mat khau

### State & Services
- `auth.store.ts` - Zustand store: user info, isAuthenticated, login(), logout()
  - Persist: user info vao localStorage
  - Access token: luu trong memory (bien JS), KHONG localStorage
  - Refresh token: HTTP-only cookie (browser tu xu ly)
- `api.ts` - Axios instance + interceptor:
  - Request interceptor: attach access token
  - Response interceptor: 401 -> auto refresh -> retry request

### Components
- `ProtectedRoute.tsx` - Redirect ve /login neu chua auth
- `AuthLayout.tsx` - Layout cho login/register pages
- Form validation: React Hook Form + Zod

## Rules
- Access token chi luu trong memory (JS variable), mat khi reload -> refresh token lo
- Axios interceptor tu dong refresh khi nhan 401
- Google OAuth: redirect sang backend, backend redirect lai voi token
- Styling: TailwindCSS, dark mode support
