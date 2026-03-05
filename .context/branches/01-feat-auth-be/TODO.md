# 01-feat-auth-be - TODO

## Auth Module
- [ ] Tao `auth.module.ts` - import PassportModule, JwtModule
- [ ] Tao `auth.controller.ts` - tat ca auth endpoints
- [ ] Tao `auth.service.ts` - logic register, login, logout, refresh, verify, reset
- [ ] Tao `local.strategy.ts` - validate email/password
- [ ] Tao `jwt.strategy.ts` - validate JWT token
- [ ] Tao `google.strategy.ts` - Google OAuth flow
- [ ] Tao DTOs: register.dto.ts, login.dto.ts, reset-password.dto.ts

## Auth Features
- [ ] Register (hash password, luu user, gui email verify)
- [ ] Login (validate credentials, tao access + refresh token)
- [ ] Logout (xoa refresh token DB, clear cookie)
- [ ] Refresh token rotation
- [ ] Google OAuth (redirect + callback + tao/link user)
- [ ] Email verification (tao token, gui email, verify endpoint)
- [ ] Forgot password (gui email voi reset link)
- [ ] Reset password (validate token, update password)

## Users Module
- [ ] Tao `users.module.ts`
- [ ] Tao `users.controller.ts` - profile endpoints
- [ ] Tao `users.service.ts` - CRUD user logic
- [ ] GET /users/me - lay thong tin user
- [ ] PATCH /users/me - cap nhat profile
- [ ] PATCH /users/me/password - doi mat khau
- [ ] POST /users/me/avatar - upload avatar

## Common
- [ ] Tao `jwt-auth.guard.ts`
- [ ] Tao `current-user.decorator.ts`

## Test manual
- [ ] Test register qua Postman
- [ ] Test login + nhan token
- [ ] Test refresh token
- [ ] Test logout
- [ ] Test Google OAuth flow
- [ ] Test email verification
- [ ] Test forgot/reset password
- [ ] Test profile endpoints
