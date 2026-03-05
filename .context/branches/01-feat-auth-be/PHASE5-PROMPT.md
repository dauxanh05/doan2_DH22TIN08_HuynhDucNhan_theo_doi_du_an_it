Toi dang lam du an DevTeamOS. Day la Phase 5 cua nhanh 01-feat-auth-be.
Phase 1-4 DA HOAN THANH (DTOs, register, login, refresh, logout, email verify, forgot/reset password).

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Google OAuth scope
- `apps/api/.env.example` - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
- `apps/api/prisma/schema.prisma` - User model (provider: AuthProvider, providerId)

## Doc cac file DA CAP NHAT (doc truoc khi sua):

- `apps/api/src/modules/auth/auth.service.ts` - Doc tat ca methods hien co
- `apps/api/src/modules/auth/auth.controller.ts` - Doc tat ca endpoints hien co
- `apps/api/src/modules/auth/auth.module.ts` - Module config

## Nhiem vu Phase 5 - Google OAuth:

### 1. Tao file: src/modules/auth/strategies/google.strategy.ts
- PassportStrategy(Strategy, 'google') - tu passport-google-oauth20
- Constructor:
  - clientID: configService.get('GOOGLE_CLIENT_ID')
  - clientSecret: configService.get('GOOGLE_CLIENT_SECRET')
  - callbackURL: configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/api/auth/google/callback'
  - scope: ['email', 'profile']
- validate(accessToken, refreshToken, profile, done):
  - Extract: email = profile.emails[0].value, name = profile.displayName, avatar = profile.photos[0]?.value, providerId = profile.id
  - Tra ve object: { email, name, avatar, providerId }

### 2. Tao file: src/modules/auth/guards/google-auth.guard.ts
- AuthGuard('google')
- Don gian, chi extends AuthGuard

### 3. Them vao auth.service.ts - googleLogin(googleUser)
Logic:
- Nhan googleUser tu Google Strategy (email, name, avatar, providerId)
- Tim user theo email trong DB
- Neu DA TON TAI:
  * Neu provider === 'LOCAL': merge account
    - Update: provider = GOOGLE, providerId, emailVerified = true
    - (Giu nguyen password cu - user van co the login bang email/password)
  * Neu provider === 'GOOGLE': chi tao tokens
- Neu CHUA TON TAI:
  * Tao user moi: { email, name, avatar, provider: GOOGLE, providerId, emailVerified: true, password: null }
- Tao access token + refresh token (dung generateTokens())
- Tra ve { accessToken, refreshToken, user }

### 4. Cap nhat auth.module.ts
- Them GoogleStrategy vao providers
- Them GoogleAuthGuard vao providers (neu can)

### 5. Cap nhat auth.controller.ts - them endpoints:

**GET /auth/google:**
- @Get('google')
- @UseGuards(GoogleAuthGuard) - trigger Google OAuth redirect
- Method body rong (Passport tu dong redirect)

**GET /auth/google/callback:**
- @Get('google/callback')
- @UseGuards(GoogleAuthGuard) - xu ly callback
- @Req() req - req.user chua Google profile (tu GoogleStrategy.validate())
- Goi authService.googleLogin(req.user)
- Set refresh token cookie (giong login)
- REDIRECT ve frontend: `${FRONTEND_URL}/auth/google/callback?token=${accessToken}`
  (Frontend se doc token tu URL va luu vao memory)

## Quy tac:

1. LEARNING MODE - giai thich:
   - OAuth 2.0 flow la gi (Authorization Code Grant)
   - Tai sao can merge account (user co the da register bang email truoc)
   - Redirect flow: Backend -> Google -> Backend callback -> Frontend
2. DOC FILE TRUOC KHI SUA
3. Luu y: Neu GOOGLE_CLIENT_ID rong, strategy se loi khi khoi dong. Giai thich cho user cach tao Google OAuth credentials tu Google Cloud Console
4. COMMIT khi xong Phase 5:
   - Hoi user author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (nhan)
   - Commit message: `feat(auth): add Google OAuth login with account merging`
   - Push len remote tuong ung
