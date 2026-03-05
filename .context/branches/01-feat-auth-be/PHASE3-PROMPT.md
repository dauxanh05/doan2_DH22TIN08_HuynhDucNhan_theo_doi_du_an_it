Toi dang lam du an DevTeamOS. Day la Phase 3 cua nhanh 01-feat-auth-be.
Phase 1 (DTOs, module setup) va Phase 2 (register, login) DA HOAN THANH.

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Refresh Token Flow (quan trong!)
- `apps/api/prisma/schema.prisma` - RefreshToken model (userId, token, expiresAt, revoked, device, ip)

## Doc cac file DA DUOC CAP NHAT (doc tat ca truoc khi sua):

- `apps/api/src/modules/auth/auth.service.ts` - Da co register(), login(), generateTokens()
- `apps/api/src/modules/auth/auth.controller.ts` - Da co POST /register, POST /login
- `apps/api/src/modules/auth/auth.module.ts` - Da co imports
- `apps/api/src/common/guards/jwt-auth.guard.ts` - Da co
- `apps/api/src/common/decorators/current-user.decorator.ts` - Da co
- `apps/api/src/main.ts` - Kiem tra da co cookie-parser chua

## Nhiem vu Phase 3 - Token System & Logout:

### 1. Them vao auth.service.ts - refresh()
Logic (Refresh Token Rotation):
- Doc refresh token tu cookie (truyen tu controller)
- Tim tat ca refresh tokens cua user trong DB (chua revoked, chua het han)
- Voi moi token trong DB: dung bcrypt.compare(rawToken, hashedToken)
- Neu khong tim thay token hop le:
  - Co the bi danh cap -> revoke TAT CA tokens cua user (bao mat)
  - throw UnauthorizedException('Refresh token khong hop le')
- Neu tim thay:
  - Revoke token cu (update revoked = true)
  - Tao cap token moi (access + refresh) bang generateTokens()
  - Tra ve { accessToken, refreshToken, user }

### 2. Them vao auth.service.ts - logout()
Logic:
- Nhan userId (tu @CurrentUser)
- Revoke tat ca refresh tokens cua user trong DB:
  ```ts
  prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true }
  })
  ```
- Tra ve { message: 'Dang xuat thanh cong' }

### 3. Cap nhat auth.controller.ts - them endpoints:

**POST /auth/refresh:**
- @Post('refresh')
- @HttpCode(HttpStatus.OK)
- KHONG can JwtAuthGuard (vi access token da het han)
- Doc refresh token tu cookie: @Req() request -> request.cookies['refresh_token']
- Neu khong co cookie: throw UnauthorizedException
- Goi authService.refresh(refreshToken)
- Set cookie moi voi refresh token moi (giong login)
- Tra ve { accessToken, user }

**POST /auth/logout:**
- @Post('logout')
- @UseGuards(JwtAuthGuard)
- @CurrentUser('id') userId
- Goi authService.logout(userId)
- Clear cookie: response.clearCookie('refresh_token', { path: '/api/auth' })
- Tra ve { message: 'Dang xuat thanh cong' }

### 4. QUAN TRONG - Cookie Parser
Kiem tra xem main.ts da co cookie-parser chua. Neu chua:
- Kiem tra cookie-parser da cai chua trong package.json
- Neu chua co: `pnpm --filter api add cookie-parser && pnpm --filter api add -D @types/cookie-parser`
- Them vao main.ts:
  ```ts
  import * as cookieParser from 'cookie-parser';
  app.use(cookieParser());
  ```

## Quy tac:

1. LEARNING MODE - giai thich:
   - Refresh Token Rotation la gi, tai sao can
   - Tai sao revoke tat ca token khi phat hien token bi danh cap
   - Cookie httpOnly vs localStorage (bao mat)
2. DOC FILE TRUOC KHI SUA
3. COMMIT khi xong Phase 3:
   - Hoi user author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (nhan)
   - Commit message: `feat(auth): add refresh token rotation and logout`
   - Push len remote tuong ung
