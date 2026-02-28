# Codebase Conventions

> Patterns THUC TE dang duoc dung trong code hien tai.
> Khac voi research/CONVENTIONS.md (quy uoc chung).

---

## Backend Patterns (dang dung)

### Module Registration

```typescript
// app.module.ts — import tat ca modules
@Module({
  imports: [
    PrismaModule,      // Global module, khong can import lai
    AuthModule,
    UsersModule,
    EmailModule,
    // ... other modules
  ],
})
export class AppModule {}
```

### Service Injection

```typescript
// Inject PrismaService trong constructor
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
}
```

### DTO Validation

```typescript
// class-validator decorators
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### Auth Guard Usage

```typescript
// Protect route voi @UseGuards
@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@CurrentUser() user: User) {
  return user;
}
```

### Cookie Setting (Refresh Token)

```typescript
// HTTP-only cookie cho refresh token
res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

## Frontend Patterns (dang dung)

### Zustand Store

```typescript
// auth.store.ts — persist middleware
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### Axios Instance

```typescript
// services/api.ts — base config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // gui cookies
});
```

### Layout Pattern

```typescript
// AuthLayout — public pages (login, register)
// DashboardLayout — protected pages (sidebar, header)
// Routes switch layout based on auth state
```

---

*Last updated: 2026-02-27*
