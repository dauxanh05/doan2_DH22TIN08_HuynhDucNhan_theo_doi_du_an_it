Toi dang lam du an DevTeamOS. Day la Phase 4 cua nhanh 01-feat-auth-be.
Phase 1-3 DA HOAN THANH (DTOs, register, login, refresh, logout da co).

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Scope
- `apps/api/.env.example` - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, FRONTEND_URL
- `apps/api/prisma/schema.prisma` - User model (emailVerified field)

## Doc cac file DA CAP NHAT (doc truoc khi sua):

- `apps/api/src/modules/auth/auth.service.ts` - Da co register(), login(), refresh(), logout()
- `apps/api/src/modules/auth/auth.controller.ts` - Da co register, login, refresh, logout endpoints
- `apps/api/src/modules/auth/auth.module.ts` - Module config
- `apps/api/src/modules/auth/dto/forgot-password.dto.ts` - Da co
- `apps/api/src/modules/auth/dto/reset-password.dto.ts` - Da co

## Nhiem vu Phase 4 - Email Features:

### 1. Tao email utility/service
Chon 1 trong 2 cach (giai thich va hoi user):

**Cach A - Tao rieng EmailService (module rieng):**
- src/modules/email/email.module.ts
- src/modules/email/email.service.ts
- @Global() de dung o bat ky dau

**Cach B - Tao helper trong auth (don gian hon):**
- Them private method sendEmail() trong AuthService
- Dung nodemailer truc tiep

Logic sendEmail (cho ca 2 cach):
```ts
import * as nodemailer from 'nodemailer';
// Tao transporter tu env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
// sendMail({ from: EMAIL_FROM, to, subject, html })
```

### 2. Them vao auth.service.ts - sendVerificationEmail()
- Tao verify token: dung JWT sign voi payload { email, type: 'verify-email' }, expiry 24h
- Gui email voi link: `${FRONTEND_URL}/verify-email/${token}`
- Dung JWT thay vi tao bang rieng trong DB (don gian, KHONG can thay doi schema)

### 3. Cap nhat register() trong auth.service.ts
- Sau khi tao user, goi sendVerificationEmail(user)
- Wrap trong try-catch de khong fail register neu email loi

### 4. Them vao auth.service.ts - verifyEmail(token)
- Verify JWT token
- Tim user theo email trong token payload
- Update emailVerified = true
- Tra ve { message: 'Email da duoc xac nhan' }

### 5. Them vao auth.service.ts - forgotPassword(email)
- Tim user theo email
- Neu khong thay: van tra ve thanh cong (bao mat - khong lo email co ton tai khong)
- Tao reset token bang JWT (expiry 1h, payload: { email, type: 'reset-password' })
- Gui email voi link: `${FRONTEND_URL}/reset-password/${token}`

### 6. Them vao auth.service.ts - resetPassword(token, newPassword)
- Verify JWT token (kiem tra type === 'reset-password')
- Tim user theo email trong payload
- Hash new password
- Update password trong DB
- Revoke tat ca refresh tokens (buoc user login lai)
- Tra ve { message: 'Mat khau da duoc dat lai' }

### 7. Cap nhat auth.controller.ts - them endpoints:

**GET /auth/verify-email/:token:**
- @Get('verify-email/:token')
- @Param('token') token
- Goi authService.verifyEmail(token)
- Hoac redirect ve frontend voi query ?verified=true

**POST /auth/forgot-password:**
- @Post('forgot-password')
- Body: ForgotPasswordDto
- Goi authService.forgotPassword(email)
- LUON tra ve { message: 'Neu email ton tai, ban se nhan duoc email huong dan' }

**POST /auth/reset-password:**
- @Post('reset-password')
- Body: ResetPasswordDto
- Goi authService.resetPassword(token, newPassword)

## Quy tac:

1. LEARNING MODE - giai thich:
   - Nodemailer la gi, cach config
   - Tai sao dung JWT lam verify/reset token (don gian, khong can them DB table)
   - Tai sao forgotPassword luon tra ve success (bao mat)
2. DOC FILE TRUOC KHI SUA
3. KHONG thay doi prisma schema (dung JWT token thay vi tao bang moi)
4. COMMIT khi xong Phase 4:
   - Hoi user author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (nhan)
   - Commit message: `feat(auth): add email verification and password reset`
   - Push len remote tuong ung
