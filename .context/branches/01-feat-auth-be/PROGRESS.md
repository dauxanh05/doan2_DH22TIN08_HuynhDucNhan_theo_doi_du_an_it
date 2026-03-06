# 01-feat-auth-be - Progress

> **Trang thai:** Hoan thanh
> **Cap nhat:** 2026-02-28

## Tien do

### Phase 1-5: Authentication (DA HOAN THANH)
- Register, Login, JWT access/refresh tokens
- Refresh token rotation, Logout
- Email verification, Password reset
- Google OAuth with account merging

### Phase 6: Users Module & Profile (HOAN THANH)

**Files da tao:**
- `src/modules/users/dto/update-profile.dto.ts` — DTO validate update profile (name, avatar, theme)
- `src/modules/users/dto/change-password.dto.ts` — DTO validate change password (currentPassword, newPassword)
- `apps/api/uploads/.gitkeep` — Git tracking cho uploads folder
- `apps/api/uploads/avatars/.gitkeep` — Git tracking cho avatars folder

**Files da sua:**
- `src/modules/users/users.service.ts` — Them 4 methods: getProfile, updateProfile, changePassword, uploadAvatar
- `src/modules/users/users.controller.ts` — Them 4 endpoints voi JwtAuthGuard + Multer file upload
- `src/main.ts` — Them static file serving cho uploads folder + NestExpressApplication type

**Package da cai:**
- `@types/multer` (devDependency) — TypeScript types cho Multer file upload

## Tat ca Endpoints (13 total)

### Auth Module (9 endpoints)
| Method | Path | Mo ta |
|--------|------|-------|
| POST | /api/auth/register | Dang ky tai khoan |
| POST | /api/auth/login | Dang nhap |
| POST | /api/auth/logout | Dang xuat |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/google | Google OAuth redirect |
| GET | /api/auth/google/callback | Google OAuth callback |
| POST | /api/auth/forgot-password | Gui email reset password |
| POST | /api/auth/reset-password | Reset password bang token |
| GET | /api/auth/verify-email/:token | Xac thuc email |

### Users Module (4 endpoints)
| Method | Path | Mo ta |
|--------|------|-------|
| GET | /api/users/me | Lay thong tin profile |
| PATCH | /api/users/me | Cap nhat profile (name, avatar, theme) |
| PATCH | /api/users/me/password | Doi mat khau |
| POST | /api/users/me/avatar | Upload avatar (max 5MB, jpg/png/gif/webp) |

## Code Review Fixes (2026-02-28)

Sau khi hoan thanh 6 phases, code review phat hien 11 van de. Tat ca da duoc fix:

| # | Van de | Fix |
|---|--------|-----|
| 1 | Refresh token O(n) bcrypt compare | SHA-256 hash + findUnique O(1) |
| 2 | JWT dung chung secret cho verify/reset | Tach rieng: `{secret}_verify`, `{secret}_reset` |
| 3 | Cookie options lap lai 4 lan | Extract constants `REFRESH_COOKIE_NAME/OPTIONS` |
| 4 | findByEmail tra password ra ngoai | Split: findByEmail (safe) + findByEmailWithPassword (login) |
| 5 | Google merge ghi de provider=GOOGLE | Giu LOCAL, chi set providerId |
| 6 | avatar trong UpdateProfileDto (path traversal) | Xoa khoi DTO, chi cho upload qua POST endpoint |
| 7 | Health check bi guard chặn | Chuyen guard tu class-level xuong method-level |
| 8 | EmailService nuot loi (return false) | Throw error, caller handle |
| 9 | Khong gioi han do dai password (bcrypt DoS) | MaxLength(72) tren tat ca password DTOs |
| 10 | try-catch rong trong verify/reset | Narrow try-catch chi quanh jwtService.verify() |
| 11 | GoogleStrategy crash khi env rong | Fallback `\|\| 'not-configured'` |

## Auth Security Hardening (2026-03-06)

Sau debug session, them 7 fixes security/performance tiep theo:

| # | Van de | Fix |
|---|--------|-----|
| 1 | Path traversal khi xoa avatar cu | `path.resolve()` + check uploads prefix + boundary check truoc `unlinkSync` |
| 2 | Khong co rate limiting | Global `ThrottlerGuard` 30 req/phut + limit rieng cho register/login/forgot-password |
| 3 | Reset password token co the dung lai | Them `User.resetNonce`, verify nonce, clear nonce sau khi reset |
| 4 | JWT access token bi dua vao URL callback Google | Doi sang one-time auth code trong cache + `POST /api/auth/google/exchange` |
| 5 | Bang `RefreshToken` tang vo han | Cleanup revoked/expired tokens trong refresh/logout/reset flows |
| 6 | Race condition khi refresh rotation | Prisma transaction + conditional revoke (`updateMany.count === 1`) |
| 7 | Thieu index cho lookup/cleanup refresh tokens | Them `@@index([userId, revoked])` va `@@index([expiresAt])` |

### Validation

- Tao va apply Prisma migration: `20260306104557_auth_security_fixes`
- Prisma Client generate thanh cong
- `nest build` pass sau khi hardening
- Regression tests cho auth flows dang duoc them

## Luu y cho nhanh 02-feat-auth-fe

1. **Avatar URL format:** `/uploads/avatars/{userId}-{timestamp}.{ext}` — frontend truy cap truc tiep qua URL nay
2. **Static files:** `main.ts` da config `useStaticAssets` — frontend khong can proxy rieng cho uploads
3. **Google OAuth users:** Khong co password, PATCH /users/me/password tra ve 400
4. **Theme enum:** `LIGHT | DARK | SYSTEM` — import tu `@prisma/client`
5. **File upload:** Dung `multipart/form-data` voi field name `avatar`
6. **Auth header:** Tat ca /users/* endpoints can `Authorization: Bearer <access_token>`
