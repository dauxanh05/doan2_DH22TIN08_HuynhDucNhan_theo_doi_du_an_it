# 02-feat-auth-fe - TODO

## State & Services
- [ ] Setup `auth.store.ts` (Zustand + persist)
- [ ] Setup `api.ts` (Axios instance + request/response interceptor)
- [ ] Implement auto refresh token logic trong interceptor

## Pages
- [ ] LoginPage - form email/password + Google login button
- [ ] RegisterPage - form name, email, password
- [ ] ForgotPasswordPage - form nhap email
- [ ] ResetPasswordPage - form nhap password moi
- [ ] VerifyEmailPage - tu dong call API verify
- [ ] ProfilePage - hien thi + edit profile
- [ ] ChangePasswordPage - form doi mat khau

## Components
- [ ] ProtectedRoute - check auth, redirect /login
- [ ] AuthLayout - layout cho auth pages

## Validation
- [ ] Zod schemas cho tat ca forms
- [ ] React Hook Form integration

## Test manual
- [ ] Test dang ky tai khoan moi
- [ ] Test dang nhap + redirect
- [ ] Test auto refresh khi token het han
- [ ] Test Google OAuth flow
- [ ] Test forgot/reset password flow
- [ ] Test cap nhat profile
- [ ] Test doi mat khau
- [ ] Test ProtectedRoute (redirect khi chua login)
