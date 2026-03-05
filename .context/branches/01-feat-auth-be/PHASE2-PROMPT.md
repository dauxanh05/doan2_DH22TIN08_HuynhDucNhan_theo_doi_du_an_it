Toi dang lam du an DevTeamOS. Day la Phase 2 cua nhanh 01-feat-auth-be.
Phase 1 DA HOAN THANH truoc do (DTOs va auth.module.ts da duoc setup).

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Scope va Refresh Token Flow
- `apps/api/prisma/schema.prisma` - Database schema (User, RefreshToken models)
- `apps/api/.env.example` - JWT_SECRET, JWT_REFRESH_SECRET, etc.

## Doc cac file DA DUOC PHASE 1 CAP NHAT (doc truoc khi sua):

- `apps/api/src/modules/auth/auth.module.ts` - Da co PassportModule, JwtModule
- `apps/api/src/modules/auth/auth.service.ts` - Con rong, can implement
- `apps/api/src/modules/auth/auth.controller.ts` - Con skeleton
- `apps/api/src/modules/auth/dto/register.dto.ts` - Da co
- `apps/api/src/modules/auth/dto/login.dto.ts` - Da co
- `apps/api/src/modules/auth/interfaces/jwt-payload.interface.ts` - JwtPayload, JwtUser
- `apps/api/src/modules/auth/strategies/jwt.strategy.ts` - Da co
- `apps/api/src/modules/users/users.service.ts` - Co findByEmail(), findById()
- `apps/api/src/common/guards/jwt-auth.guard.ts` - Da co
- `apps/api/src/common/decorators/current-user.decorator.ts` - Da co
- `apps/api/src/main.ts` - Co ValidationPipe, CORS credentials: true

## Nhiem vu Phase 2 - Register & Login:

### 1. Implement auth.service.ts - register()
Logic:
- Nhan RegisterDto (email, password, name)
- Kiem tra email da ton tai chua (dung UsersService.findByEmail hoac truc tiep Prisma)
- Neu ton tai: throw ConflictException('Email da duoc su dung')
- Hash password bang bcrypt (10 rounds)
- Tao user qua prisma.user.create({ data: { email, password: hashedPassword, name } })
- (Chua can gui email verify o phase nay - Phase 4 se lam)
- Tra ve user info (KHONG tra password)

Constructor cua AuthService can inject:
- PrismaService
- JwtService (tu @nestjs/jwt)
- ConfigService (tu @nestjs/config)
- UsersService (tu UsersModule - da import o Phase 1)

### 2. Implement auth.service.ts - login()
Logic:
- Nhan email, password
- Tim user bang email
- Neu khong thay hoac password null: throw UnauthorizedException
- So sanh password voi bcrypt.compare()
- Neu sai: throw UnauthorizedException('Email hoac mat khau khong dung')
- Tao access token (JWT):
  payload: { sub: user.id, email: user.email, type: 'access' }
  expiresIn: configService.get('JWT_EXPIRES_IN') || '15m'
- Tao refresh token:
  Dung crypto.randomBytes(64).toString('hex')
  Hash bang bcrypt
  Luu vao DB: prisma.refreshToken.create({ data: { userId, token: hashedToken, expiresAt: 7 ngay sau } })
- Tra ve: { accessToken, refreshToken (raw, chua hash - de set cookie) }

### 3. Implement auth.service.ts - method helper generateTokens() (private)
- Tao access token + refresh token
- Luu refresh token vao DB
- Tra ve { accessToken, refreshToken }
(Dung chung cho login va refresh)

### 4. Cap nhat auth.controller.ts
Them endpoints:

**POST /auth/register:**
- @Post('register')
- @HttpCode(HttpStatus.CREATED)
- Body: RegisterDto
- Goi authService.register()
- Tra ve { message: 'Dang ky thanh cong', user: {...} }

**POST /auth/login:**
- @Post('login')
- @HttpCode(HttpStatus.OK)
- Body: LoginDto
- Goi authService.login()
- Set refresh token vao HTTP-only cookie:
  ```ts
  response.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngay
    path: '/api/auth',
  })
  ```
- Tra ve { accessToken, user: {...} } (KHONG tra refreshToken trong body)

Controller constructor inject: AuthService
Controller can import: @Res({ passthrough: true }) Response tu express

### 5. Tao file: src/modules/auth/strategies/local.strategy.ts
- PassportStrategy(Strategy, 'local')
- validate(email, password): goi authService.validateUser()
- Hoac: Skip file nay neu khong dung LocalAuthGuard. Trong NestJS, co the validate truc tiep trong login endpoint ma khong can LocalStrategy. Giai thich cho user va hoi muon dung cach nao.

## Quy tac:

1. LEARNING MODE:
   - Giai thich tung method/endpoint bang tieng Viet
   - Truoc moi buoc: "Day la gi", "Tai sao can", "Cach hoat dong"
   - Hoi "Ban san sang chua?" truoc khi bat dau
   - Dung step-by-step, khong lam nhieu file cung luc

2. DOC FILE TRUOC KHI SUA - dac biet auth.service.ts va auth.controller.ts da co gi

3. IMPORT CAN THAN:
   - bcrypt: `import * as bcrypt from 'bcrypt'`
   - crypto: `import { randomBytes } from 'crypto'`

4. COMMIT khi hoan thanh Phase 2:
   - Hoi user muon dung author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (push len origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (push len nhan)
   - Commit message: `feat(auth): implement register and login with JWT`
   - Push len remote tuong ung
