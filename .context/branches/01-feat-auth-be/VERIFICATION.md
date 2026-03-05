# 01-feat-auth-be — Verification

> Checklist verify theo requirement IDs.
> Test bang Postman (API) hoac browser (Google OAuth).

---

## Requirements Checklist

### Auth

- [x] **AUTH-01**: POST /auth/register — dang ky thanh cong, tra ve user object, password da hash
- [x] **AUTH-02**: POST /auth/login — dang nhap thanh cong, tra ve access token, set refresh cookie
- [x] **AUTH-03**: POST /auth/refresh — tra ve access token moi + refresh token moi (rotation)
- [x] **AUTH-04**: POST /auth/logout — xoa refresh token DB, clear cookie
- [x] **AUTH-05**: GET /auth/google — redirect to Google, callback tao/merge user, tra ve tokens
- [x] **AUTH-06**: GET /auth/verify-email/:token — verify email thanh cong, emailVerified = true
- [x] **AUTH-07**: POST /auth/forgot-password — gui email chua reset link
- [x] **AUTH-08**: POST /auth/reset-password — dat lai password thanh cong voi valid token

### Users

- [ ] **AUTH-09**: GET /users/me tra ve user info. PATCH /users/me cap nhat name/avatar/theme
- [ ] **AUTH-10**: PATCH /users/me/password — doi password (can old password)
- [ ] **AUTH-11**: POST /users/me/avatar — upload file, luu local, tra ve URL

### Common

- [ ] **AUTH-12**: Request khong co token → 401. Request co expired token → 401
- [ ] **AUTH-13**: @CurrentUser() tra ve user object tu request

## Test Results

| Requirement | Method | Status | Notes |
|-------------|--------|--------|-------|
| AUTH-01 | Postman | PASS | |
| AUTH-02 | Postman | PASS | |
| AUTH-03 | Postman | PASS | Token cu bi revoke |
| AUTH-04 | Postman | PASS | |
| AUTH-05 | Browser | PASS | Merge voi existing email OK |
| AUTH-06 | Postman | PASS | |
| AUTH-07 | Postman | PASS | Email gui thanh cong |
| AUTH-08 | Postman | PASS | Token het han 1h |
| AUTH-09 | Postman | - | Chua test |
| AUTH-10 | Postman | - | Chua test |
| AUTH-11 | Postman | - | Chua test |
| AUTH-12 | Postman | - | Chua test |
| AUTH-13 | Postman | - | Chua test |

## Issues Found

(Chua co)

---

*Last verified: 2026-02-27*
