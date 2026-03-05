Toi dang lam du an DevTeamOS. Day la Phase 1 cua nhanh 01-feat-auth-be.

## Buoc 0: Chuyen sang branch

```bash
git checkout 01-feat-auth-be
```
(Neu chua co branch, tao tu main: `git checkout main && git pull && git checkout -b 01-feat-auth-be`)

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, architecture, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Scope nhanh nay
- `apps/api/src/modules/auth/auth.module.ts` - Skeleton hien tai
- `apps/api/src/modules/auth/auth.service.ts` - Skeleton hien tai
- `apps/api/src/modules/auth/auth.controller.ts` - Skeleton hien tai
- `apps/api/src/modules/auth/strategies/jwt.strategy.ts` - Da co san
- `apps/api/src/modules/auth/interfaces/jwt-payload.interface.ts` - Da co san
- `apps/api/src/modules/users/users.module.ts` - Skeleton hien tai
- `apps/api/src/modules/users/users.service.ts` - Co findByEmail, findById
- `apps/api/src/app.module.ts` - Root module (ConfigModule da isGlobal: true)
- `apps/api/src/prisma/prisma.module.ts` - Da @Global()
- `apps/api/.env.example` - Cac bien moi truong
- `apps/api/prisma/schema.prisma` - Database schema

## Noi dung hien tai cua cac file skeleton (de ban biet trang thai):

### auth.module.ts (CHI CO skeleton co ban):
- Chi import AuthController, AuthService
- CHUA co PassportModule, JwtModule, ConfigModule, UsersModule

### auth.service.ts (RONG):
- Chi co @Injectable() class AuthService {} - KHONG co logic

### auth.controller.ts (CHI CO health check):
- Chi co GET /auth/health

### jwt.strategy.ts (DA HOAN THANH):
- Da config ExtractJwt.fromAuthHeaderAsBearerToken()
- Da validate() kiem tra payload.type === 'access'
- Tra ve { id: payload.sub, email: payload.email }

### jwt-payload.interface.ts (DA HOAN THANH):
- JwtPayload: { sub, email, type: 'access' | 'refresh' }
- JwtUser: { id, email }

### users.service.ts (CO 2 method):
- findByEmail(email) va findById(id) - da co

## Nhiem vu Phase 1 - Auth Setup & DTOs:

### 1. Cap nhat auth.module.ts
Bo sung imports can thiet vao AuthModule:
- PassportModule.register({ defaultStrategy: 'jwt' })
- JwtModule.registerAsync({...}) voi:
  - inject ConfigService
  - secret tu JWT_SECRET
  - signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '15m' }
- UsersModule (de AuthService co the dung UsersService)
- Them JwtStrategy vao providers

### 2. Tao file: src/modules/auth/dto/register.dto.ts
- class RegisterDto
- Fields: email (IsEmail, IsNotEmpty), password (IsString, MinLength(6)), name (IsString, IsNotEmpty)
- Dung class-validator decorators
- Them ApiProperty tu @nestjs/swagger cho moi field

### 3. Tao file: src/modules/auth/dto/login.dto.ts
- class LoginDto
- Fields: email (IsEmail), password (IsString)
- Swagger ApiProperty

### 4. Tao file: src/modules/auth/dto/forgot-password.dto.ts
- class ForgotPasswordDto
- Field: email (IsEmail)

### 5. Tao file: src/modules/auth/dto/reset-password.dto.ts
- class ResetPasswordDto
- Fields: token (IsString, IsNotEmpty), newPassword (IsString, MinLength(6))

### 6. Kiem tra jwt-payload.interface.ts
- Da co san, chi can doc va xac nhan dung. Neu can sua gi thi sua.

## Quy tac:

1. LEARNING MODE:
   - Giai thich tung buoc bang tieng Viet
   - Giu nguyen thuat ngu tieng Anh (DTO, module, decorator...)
   - Truoc moi file: giai thich "Day la gi", "Tai sao can", "Cach hoat dong"
   - Hoi "Ban san sang chua?" truoc khi bat dau
   - Code comments bang tieng Anh

2. DOC FILE TRUOC KHI SUA - giu lai code dung, chi bo sung

3. COMMIT khi hoan thanh Phase 1:
   - TRUOC KHI COMMIT: Hoi user muon dung author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (push len origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (push len nhan)
   - Commit message: `feat(auth): add auth module setup and DTOs`
   - Push len remote tuong ung

4. Khong tao file moi ma khong giai thich truoc
5. Khong cai them dependencies (da co du)
