# 01-feat-auth-be — Execution Plan

---

## Objective

**What:** Implement toan bo backend auth (register, login, JWT, refresh, Google OAuth, email verify, reset password) + users module (profile, change password, avatar)
**Why:** Day la foundation cho toan bo app — khong co auth thi khong lam gi duoc
**Output:** API hoan chinh, test duoc bang Postman

---

## Tasks

### Task 1: Auth module setup + DTOs ✅

- **Files:** `auth.module.ts`, `auth.controller.ts`, `auth.service.ts`, `dto/*.ts`
- **Action:** Tao module voi PassportModule, JwtModule. Tao DTOs voi class-validator.
- **Verify:** Module import thanh cong, app khong crash
- **Done:** Module registered trong app.module.ts

### Task 2: Register + Login voi JWT ✅

- **Files:** `auth.service.ts`, `auth.controller.ts`, `jwt.strategy.ts`
- **Action:** Register hash password + luu DB. Login validate + tao access token + refresh token cookie.
- **Verify:** Postman: POST /auth/register tra ve user. POST /auth/login tra ve access token + set cookie.
- **Done:** AUTH-01, AUTH-02 pass

### Task 3: Refresh token rotation + Logout ✅

- **Files:** `auth.service.ts`, `auth.controller.ts`
- **Action:** POST /auth/refresh doc cookie, hash, so sanh DB, tao cap token moi. POST /auth/logout xoa DB + clear cookie.
- **Verify:** Postman: refresh tra ve token moi, token cu khong dung duoc. Logout clear cookie.
- **Done:** AUTH-03, AUTH-04 pass

### Task 4: Email verification + Password reset ✅

- **Files:** `auth.service.ts`, `email.service.ts`
- **Action:** Register gui email verify link. Forgot password gui email reset link. Verify/reset endpoints validate token + update DB.
- **Verify:** Postman: gui email, click link, verify/reset thanh cong.
- **Done:** AUTH-06, AUTH-07, AUTH-08 pass

### Task 5: Google OAuth ✅

- **Files:** `google.strategy.ts`, `google-auth.guard.ts`, `auth.controller.ts`
- **Action:** Google OAuth redirect + callback. Tao user moi hoac merge voi existing email.
- **Verify:** Browser: click Google login, redirect back voi token.
- **Done:** AUTH-05 pass

### Task 6: Users module (profile, password, avatar) — TIEP THEO

- **Files:** `users.controller.ts`, `users.service.ts`, DTOs
- **Action:** GET/PATCH /users/me, PATCH password, POST avatar upload (multer, local storage)
- **Verify:** Postman: lay profile, update name, doi password, upload avatar file
- **Done:** AUTH-09, AUTH-10, AUTH-11 pass

### Task 7: Auth guards + CurrentUser decorator — TIEP THEO

- **Files:** `jwt-auth.guard.ts`, `current-user.decorator.ts`
- **Action:** Hoan thien guard + decorator, apply cho users endpoints
- **Verify:** Request khong co token → 401. Request co token → tra ve user data.
- **Done:** AUTH-12, AUTH-13 pass

---

## Success Criteria

- [x] Register + Login hoat dong
- [x] Refresh token rotation hoat dong
- [x] Google OAuth hoat dong
- [x] Email verify + Reset password hoat dong
- [ ] Users profile CRUD hoat dong
- [ ] Auth guard bao ve tat ca protected routes
- [ ] Tat ca 13 requirements (AUTH-01..AUTH-13) pass

---

*Created: 2026-02-27*
