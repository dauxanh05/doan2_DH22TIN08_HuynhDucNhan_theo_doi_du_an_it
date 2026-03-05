# Prompt phan cong - Nhanh 01-feat-auth-be

> Copy doan nay vao Claude CLI session moi de bat dau lam nhanh 01:

---

Toi dang lam du an DevTeamOS - webapp quan ly tien do du an. Day la phan cong tu main dispatcher.

## Buoc 0: Setup branch

```bash
git checkout main && git pull
git checkout -b 01-feat-auth-be
```

## Doc cac file nay de hieu scope:

- `CLAUDE.md` - Project guidelines, architecture, learning mode rules
- `branches/01-feat-auth-be/CONTEXT.md` - Chi tiet scope nhanh nay
- `branches/01-feat-auth-be/TODO.md` - Checklist can hoan thanh
- `apps/api/prisma/schema.prisma` - Database schema (da hoan thanh tu nhanh 00)
- `apps/api/.env.example` - Environment variables

## Tinh trang hien tai

Code skeleton DA CO SAN (tu nhanh 00), ban can BO SUNG logic vao:

**Auth module** (`src/modules/auth/`):
- `auth.module.ts` - Co san, can them imports (PassportModule, JwtModule, ConfigModule...)
- `auth.controller.ts` - Co san skeleton, can them endpoints
- `auth.service.ts` - Co san skeleton, can them logic
- `strategies/jwt.strategy.ts` - Co san, can kiem tra va chinh sua neu can
- `interfaces/jwt-payload.interface.ts` - Co san

**Users module** (`src/modules/users/`):
- `users.module.ts`, `users.controller.ts`, `users.service.ts` - Co san skeleton

**Common** (`src/common/`):
- `guards/jwt-auth.guard.ts` - Co san
- `decorators/current-user.decorator.ts` - Co san

**Dependencies DA CAI** (khong can `pnpm add`):
bcrypt, passport, passport-jwt, passport-google-oauth20, @nestjs/passport, @nestjs/jwt, nodemailer, class-validator, class-transformer

## Lam theo thu tu 6 phases:

### Phase 1: Auth Setup & DTOs
- Kiem tra `auth.module.ts` hien tai, bo sung imports can thiet (PassportModule, JwtModule voi config, ConfigModule)
- Tao `dto/register.dto.ts` (email, password, name) voi class-validator
- Tao `dto/login.dto.ts` (email, password)
- Tao `dto/forgot-password.dto.ts` (email)
- Tao `dto/reset-password.dto.ts` (token, newPassword)
- Kiem tra + chinh sua `jwt-payload.interface.ts` neu can

### Phase 2: Register & Login
- `auth.service.ts`: implement register() - hash password (bcrypt), luu user qua Prisma, gui email verify
- `auth.service.ts`: implement login() - validate credentials, tao access token (JWT, 15 phut) + refresh token (random string, hash roi luu DB, set HTTP-only cookie 7 ngay)
- `auth.controller.ts`: POST /auth/register + POST /auth/login
- Tao `strategies/local.strategy.ts` - validate email/password

### Phase 3: Token System & Logout
- `auth.service.ts`: implement refresh() - doc refresh token tu cookie, hash, so sanh DB, tao cap token moi (rotation), xoa token cu
- `auth.service.ts`: implement logout() - xoa refresh token trong DB, clear cookie
- `auth.controller.ts`: POST /auth/refresh + POST /auth/logout
- Dam bao JwtAuthGuard bao ve cac route can thiet

### Phase 4: Email Features
- `auth.service.ts`: implement sendVerificationEmail() - tao token, gui email bang Nodemailer
- `auth.service.ts`: implement verifyEmail() - validate token, update emailVerified = true
- `auth.service.ts`: implement forgotPassword() - tao reset token, gui email
- `auth.service.ts`: implement resetPassword() - validate token, hash new password, update user
- `auth.controller.ts`: GET /auth/verify-email/:token + POST /auth/forgot-password + POST /auth/reset-password

### Phase 5: Google OAuth
- Tao `strategies/google.strategy.ts` - Google OAuth strategy
- `auth.service.ts`: implement googleLogin() - tao/link user tu Google profile, merge account neu email da ton tai
- `auth.controller.ts`: GET /auth/google + GET /auth/google/callback
- Redirect ve frontend sau khi login thanh cong voi token

### Phase 6: Users Module & Profile
- `users.service.ts`: implement findById(), updateProfile(), changePassword(), uploadAvatar()
- `users.controller.ts`: GET /users/me + PATCH /users/me + PATCH /users/me/password + POST /users/me/avatar
- Tat ca endpoints can JwtAuthGuard bao ve
- Upload avatar dung multer (luu vao UPLOAD_DIR)

## Quy tac:

1. **Learning Mode** - Lam tung phase, giai thich tung buoc. Hoi "Ban san sang chua?" truoc khi lam moi phase
2. **Code comments** bang tieng Anh, giai thich bang tieng Viet
3. **Skip unit tests** - Chi can test manual qua Postman
4. **Commit message** theo format: `feat(auth): <message>` hoac `feat(users): <message>`
5. **Khong tao file moi** ma khong giai thich truoc tai sao can
6. **Doc file hien tai truoc** khi sua - giu lai code dung, chi bo sung
7. **Push len ca 2 remote** khi xong:
   - `git push origin 01-feat-auth-be`
   - `git push nhan 01-feat-auth-be`
   - Hoi user muon dung author nao truoc khi commit

## Khi hoan thanh:

Bao cao lai voi thong tin:
1. Danh sach files da tao/sua
2. Danh sach endpoints hoat dong (method + path + mo ta)
3. Nhung gi can luu y cho nhanh tiep theo (02-feat-auth-fe)
4. Cap nhat file `branches/01-feat-auth-be/PROGRESS.md`
