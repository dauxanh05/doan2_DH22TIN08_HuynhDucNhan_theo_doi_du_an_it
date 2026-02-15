# Phan 1: Auth & User

> **Quyet dinh:** Lam day du tat ca features trong MVP

---

## Tong quan

Phan nay xu ly toan bo viec xac thuc nguoi dung va quan ly thong tin ca nhan.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Register/Login | Email + Password |
| Google OAuth | **Lam luon** cung email/password |
| Email Verification | **Lam luon** (can SMTP) |
| Forgot/Reset Password | **Lam luon** (can SMTP) |
| Refresh Token | **Database + Cookie** (an toan nhat, co the revoke) |
| Profile, Change Password | Giu nguyen |
| Auth Guards & Protected Routes | Giu nguyen |

### Can chuan bi truoc
- Google Client ID/Secret (tao tu Google Cloud Console)
- SMTP credentials (Gmail App Password hoac dich vu khac)

---

## API Endpoints

### Auth
```
POST   /auth/register          # Dang ky email/password
POST   /auth/login             # Dang nhap -> tra ve access token + set refresh token cookie
POST   /auth/logout            # Dang xuat (clear refresh token trong DB + cookie)
POST   /auth/refresh           # Refresh access token (doc refresh token tu cookie)
GET    /auth/google            # Redirect to Google OAuth
GET    /auth/google/callback   # Google OAuth callback
POST   /auth/forgot-password   # Gui email reset password
POST   /auth/reset-password    # Dat lai mat khau
GET    /auth/verify-email/:token  # Verify email
```

### Users
```
GET    /users/me               # Thong tin user hien tai
PATCH  /users/me               # Cap nhat profile (name, avatar, theme)
PATCH  /users/me/password      # Doi mat khau
POST   /users/me/avatar        # Upload avatar
```

---

## Refresh Token Flow (Database + Cookie)

```
1. User login thanh cong
   -> Server tao access token (JWT, 15 phut)
   -> Server tao refresh token (random string)
   -> Hash refresh token -> luu vao DB (bang RefreshToken hoac field trong User)
   -> Set refresh token vao HTTP-only cookie (7 ngay)
   -> Tra ve access token trong response body

2. Access token het han
   -> Frontend gui POST /auth/refresh
   -> Server doc refresh token tu cookie
   -> Hash va so sanh voi DB
   -> Neu khop: tao access token moi + refresh token moi (rotation)
   -> Neu khong khop: tra ve 401, user phai login lai

3. Logout
   -> Xoa refresh token trong DB
   -> Clear cookie
```

---

## Database (lien quan)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?   // null neu dung OAuth
  name          String
  avatar        String?
  provider      AuthProvider @default(LOCAL)
  providerId    String?   // Google user ID
  theme         Theme     @default(SYSTEM)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // relations...
}

enum AuthProvider {
  LOCAL
  GOOGLE
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}
```

> **Note:** Can them bang/field cho refresh token trong schema.

---

## Frontend Pages

| Page | Route | Mo ta |
|------|-------|-------|
| Login | `/login` | Form email/password + nut Google login |
| Register | `/register` | Form name, email, password |
| Forgot Password | `/forgot-password` | Nhap email -> gui link reset |
| Reset Password | `/reset-password/:token` | Nhap password moi |
| Verify Email | `/verify-email/:token` | Tu dong verify khi truy cap |
| Profile | `/settings/profile` | Xem/sua name, avatar, theme |
| Change Password | `/settings/password` | Doi mat khau |

### Frontend State (Zustand)
- `auth.store.ts`: user info, isAuthenticated, login(), logout()
- Persist: luu user info vao localStorage
- Access token: luu trong memory (bien JS), KHONG luu localStorage
- Refresh token: HTTP-only cookie (browser tu xu ly)

---

## Files can tao/cap nhat

### Backend
- `src/modules/auth/auth.module.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/strategies/jwt.strategy.ts`
- `src/modules/auth/strategies/google.strategy.ts`
- `src/modules/auth/strategies/local.strategy.ts`
- `src/modules/auth/dto/register.dto.ts`
- `src/modules/auth/dto/login.dto.ts`
- `src/modules/auth/dto/reset-password.dto.ts`
- `src/modules/auth/interfaces/jwt-payload.interface.ts`
- `src/modules/users/users.module.ts`
- `src/modules/users/users.controller.ts`
- `src/modules/users/users.service.ts`
- `src/common/guards/jwt-auth.guard.ts`
- `src/common/decorators/current-user.decorator.ts`

### Frontend
- `src/stores/auth.store.ts`
- `src/services/api.ts` (axios instance + interceptor)
- `src/features/auth/LoginPage.tsx`
- `src/features/auth/RegisterPage.tsx`
- `src/features/auth/ForgotPasswordPage.tsx`
- `src/features/auth/ResetPasswordPage.tsx`
- `src/components/ProtectedRoute.tsx`

---

*Last updated: 2026-02-15*
