# Tab Fix Auth Bugs — OTP Verification + Google OAuth

## Vai tro
Ban la developer fix 2 bugs trong auth module cua DevTeamOS.
**KHONG tu y thay doi gi ngoai scope** — chi fix dung nhung gi duoi day.

## Rules BAT BUOC
1. Doc file TRUOC khi sua — khong tu bia imports, paths, functions
2. Giu nguyen patterns hien tai: NestJS + class-validator DTOs + Swagger decorators
3. Giu nguyen naming conventions tieng Viet cho messages
4. Sau moi phase: chay `cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter api exec tsc --noEmit && pnpm --filter web exec tsc --noEmit` xac nhan PASS
5. KHONG commit — bao lai T1 tab khi xong

---

## Bug 1: OTP Email Verification (thay the link verification)

### Hien tai (SAI)
- Register tao user vao DB ngay lap tuc
- Gui email verify link (JWT token)
- Login KHONG check emailVerified → user chua verify van login duoc

### Yeu cau (DUNG)
- Register KHONG tao user vao DB
- Gui OTP 6 so ve email, luu pending data + OTP vao cache (5 phut)
- FE hien form nhap OTP
- Verify OTP dung → tao user vao DB (emailVerified: true) → tra tokens → auto login
- Xoa flow verify-email cu (link-based)

### Phase 1 — Backend changes

#### 1.1 Tao DTO files

File: `apps/api/src/modules/auth/dto/send-otp.dto.ts`
```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email khong hop le' })
  email: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty({ message: 'Ten khong duoc de trong' })
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Mat khau toi thieu 6 ky tu' })
  password: string;
}
```

File: `apps/api/src/modules/auth/dto/verify-otp.dto.ts`
```typescript
import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email khong hop le' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'OTP phai co 6 ky tu' })
  otp: string;
}
```

#### 1.2 Sua auth.service.ts

**Them 2 methods moi:**

```typescript
// Constants o dau file
const OTP_TTL_MS = 5 * 60 * 1000; // 5 phut
const OTP_LENGTH = 6;

async sendOtp(dto: SendOtpDto) {
  // Check email da ton tai chua
  const existingUser = await this.usersService.findByEmail(dto.email);
  if (existingUser) {
    throw new ConflictException('Email da duoc su dung');
  }

  // Generate OTP 6 so
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash password truoc khi luu vao cache
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  // Luu pending data + OTP vao cache
  const cacheKey = `register-otp:${dto.email.toLowerCase()}`;
  await this.cacheManager.set(cacheKey, {
    email: dto.email,
    name: dto.name,
    password: hashedPassword,
    otp,
  }, OTP_TTL_MS);

  // Gui email OTP
  try {
    await this.emailService.sendMail(
      dto.email,
      'Ma xac thuc OTP - DevTeamOS',
      `
        <h2>Chao mung ban den voi DevTeamOS!</h2>
        <p>Ma xac thuc cua ban la:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px;margin:16px 0;">
          ${otp}
        </div>
        <p>Ma nay se het han sau 5 phut.</p>
        <p>Neu ban khong dang ky tai khoan, vui long bo qua email nay.</p>
      `,
    );
  } catch (error) {
    this.logger.error(`Failed to send OTP email to ${dto.email}`, error.message);
    throw new BadRequestException('Khong the gui email OTP. Vui long thu lai.');
  }

  return { message: 'Ma OTP da duoc gui den email cua ban' };
}

async verifyOtp(email: string, otp: string) {
  const cacheKey = `register-otp:${email.toLowerCase()}`;
  const cached = await this.cacheManager.get<{
    email: string;
    name: string;
    password: string;
    otp: string;
  }>(cacheKey);

  if (!cached) {
    throw new BadRequestException('Ma OTP da het han. Vui long dang ky lai.');
  }

  if (cached.otp !== otp) {
    throw new BadRequestException('Ma OTP khong dung');
  }

  // Xoa OTP khoi cache
  await this.cacheManager.del(cacheKey);

  // Check email lan nua (phong truong hop race condition)
  const existingUser = await this.usersService.findByEmail(cached.email);
  if (existingUser) {
    throw new ConflictException('Email da duoc su dung');
  }

  // Tao user voi emailVerified: true
  const created = await this.prisma.user.create({
    data: {
      email: cached.email,
      password: cached.password,
      name: cached.name,
      emailVerified: true,
    },
  });

  // Generate tokens de auto-login
  const tokens = await this.generateTokens(created.id, created.email);

  const { password: _, ...user } = created;
  return {
    ...tokens,
    user,
  };
}
```

**Sua method `register()` thanh wrapper (hoac xoa neu khong can backward compat):**
- Xoa method `register()` cu
- Xoa method `sendVerificationEmail()` cu
- Xoa method `verifyEmail()` cu

**Sua method `login()` — them check emailVerified:**
```typescript
async login(email: string, password: string) {
  const user = await this.usersService.findByEmailWithPassword(email);

  if (!user || !user.password) {
    throw new UnauthorizedException('Email hoac mat khau khong dung');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Email hoac mat khau khong dung');
  }

  // Block unverified users
  if (!user.emailVerified) {
    throw new UnauthorizedException('Vui long xac thuc email truoc khi dang nhap');
  }

  const tokens = await this.generateTokens(user.id, user.email);
  const { password: _, ...userWithoutPassword } = user;
  return { ...tokens, user: userWithoutPassword };
}
```

**Import SendOtpDto** o dau file.

#### 1.3 Sua auth.controller.ts

**Xoa:**
- Route `POST /register` (thay bang send-otp)
- Route `GET /verify-email/:token`

**Them:**
```typescript
@Post('send-otp')
@Throttle({ default: { limit: 3, ttl: 60_000 } })
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Send OTP to email for registration' })
@ApiResponse({ status: 200, description: 'OTP sent' })
@ApiResponse({ status: 409, description: 'Email already exists' })
async sendOtp(@Body() dto: SendOtpDto) {
  return this.authService.sendOtp(dto);
}

@Post('verify-otp')
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Verify OTP and create account' })
@ApiResponse({ status: 201, description: 'Account created, tokens returned' })
@ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) response: Response) {
  const { accessToken, refreshToken, user } = await this.authService.verifyOtp(dto.email, dto.otp);

  response.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);

  return { accessToken, user };
}
```

**Import** SendOtpDto, VerifyOtpDto o dau file.

### Phase 2 — Frontend changes

#### 2.1 Tao hook `apps/web/src/hooks/useVerifyOtp.ts`
```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

interface VerifyOtpResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider: 'LOCAL' | 'GOOGLE';
    theme: 'LIGHT' | 'DARK' | 'SYSTEM';
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export function useVerifyOtp(redirectTo?: string) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Xac thuc thanh cong! Chao mung ban.');
      navigate(redirectTo || '/', { replace: true });
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Xac thuc OTP that bai';
      toast.error(message);
    },
  });
}
```

#### 2.2 Sua `useRegister.ts` — goi send-otp thay vi register
```typescript
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface SendOtpDto {
  name: string;
  email: string;
  password: string;
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async (data: SendOtpDto) => {
      const response = await api.post('/auth/send-otp', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ma OTP da duoc gui den email cua ban!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gui OTP that bai';
      toast.error(message);
    },
  });
}
```
**Rename file** `useRegister.ts` → giữ file nhưng sửa nội dung export `useSendOtp` thay vì `useRegister`

#### 2.3 Sua `RegisterPage.tsx` — them buoc OTP

Flow moi:
1. **Step 1:** Form dang ky (name, email, password, confirmPassword) → goi `useSendOtp`
2. **Step 2:** Form nhap OTP 6 so → goi `useVerifyOtp` → auto login

Dung `useState` de track step:
```typescript
const [step, setStep] = useState<'register' | 'otp'>('register');
const [email, setEmail] = useState('');
```

Khi `useSendOtp` success → `setStep('otp')` + `setEmail(data.email)`
Step OTP: 6 input boxes (hoac 1 input maxLength=6), nut "Xac nhan", nut "Gui lai ma"

#### 2.4 Xoa file khong can nua
- `apps/web/src/features/auth/pages/VerifyEmailPage.tsx` — XOA
- `apps/web/src/hooks/useVerifyEmail.ts` — XOA

#### 2.5 Sua `App.tsx`
- Xoa route `/verify-email/:token`

---

## Bug 2: Google OAuth Fix

### Phase 3 — Google OAuth

#### 3.1 Fix `GoogleLoginButton.tsx`
```typescript
export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Use relative path — Vite proxy will forward to API
    window.location.href = '/api/auth/google';
  };
  // ... rest giu nguyen
}
```

#### 3.2 Tao `apps/web/src/features/auth/pages/GoogleCallbackPage.tsx`
```typescript
import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const hasCalled = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code || hasCalled.current) return;
    hasCalled.current = true;

    api.post('/auth/google/exchange', { code })
      .then((res) => {
        const { accessToken, user } = res.data;
        // Neu response chi co accessToken (khong co user), goi /users/me
        if (user) {
          setAuth(user, accessToken);
          toast.success('Dang nhap Google thanh cong!');
          navigate('/', { replace: true });
        } else {
          // Set token truoc, roi fetch user
          useAuthStore.getState().setAccessToken(accessToken);
          api.get('/users/me').then((userRes) => {
            setAuth(userRes.data, accessToken);
            toast.success('Dang nhap Google thanh cong!');
            navigate('/', { replace: true });
          });
        }
      })
      .catch(() => {
        toast.error('Dang nhap Google that bai');
        navigate('/login', { replace: true });
      });
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Dang xu ly dang nhap Google...</p>
      </div>
    </div>
  );
}
```

#### 3.3 Sua `App.tsx` — them route Google callback
Them trong AuthLayout routes (ngoai PublicRoute):
```tsx
<Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
```

#### 3.4 Fix `google.strategy.ts` — sua fallback port
Dong 14: `'http://localhost:3000/api/auth/google/callback'` → `'http://localhost:3001/api/auth/google/callback'`

---

## Verification Checklist

Sau khi fix xong, chay:
```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM
pnpm --filter api exec tsc --noEmit
pnpm --filter web exec tsc --noEmit
```

Ca 2 phai PASS.

Bao lai T1 tab: "Bug 1 + Bug 2 da fix xong. tsc pass."
