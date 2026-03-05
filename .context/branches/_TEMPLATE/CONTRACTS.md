# Contracts — TEMPLATE

> **T1 tao file nay SAU KHI doc code thuc te.**
> Chat phu (T2/T3) PHAI follow dung interfaces trong file nay.
> KHONG duoc tu bua import, function, interface ngoai danh sach.

---

## Existing Code (DA CO — KHONG duoc tu bia)

> T1: Liet ke cac module, service, guard, decorator DA TON TAI trong codebase.
> Ghi ro import path + cach su dung.

### PrismaService

```typescript
// Import
import { PrismaService } from '../../prisma/prisma.service';

// Inject
constructor(private prisma: PrismaService) {}

// Usage — truy cap models theo Prisma Client API
this.prisma.user.findUnique({ where: { id } });
this.prisma.user.create({ data: { ... } });
```

### Guards & Decorators

```typescript
// JWT Auth Guard — bao ve route can dang nhap
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)

// Current User Decorator — lay user tu request
import { CurrentUser } from '../../common/decorators/current-user.decorator';
@CurrentUser() user: User
```

### (Them cac module/service khac da ton tai)

```typescript
// Vi du:
// import { EmailService } from '../email/email.service';
// import { AuthService } from '../auth/auth.service';
```

---

## Database Schema (doc tu schema.prisma)

> T1: Copy phan schema lien quan tu `apps/api/prisma/schema.prisma`
> De T2/T3 biet chinh xac fields, relations, enums.

```prisma
// Paste schema lien quan o day
```

---

## New Interfaces (CAN TAO trong task nay)

> T1: Dinh nghia truoc interfaces/types ma T2/T3 can tao.
> Ghi ro: ten, params, return type.

```typescript
// Vi du:
// interface UserResponse {
//   id: string;
//   email: string;
//   name: string;
//   avatar: string | null;
//   theme: Theme;
//   createdAt: Date;
// }
```

---

## New Files (DUOC PHEP tao)

> T1: Liet ke chinh xac files ma T2/T3 duoc tao moi.
> KHONG duoc tao file ngoai danh sach nay.

```
- src/modules/xxx/dto/yyy.dto.ts
- src/modules/xxx/xxx.service.ts (da co skeleton, bo sung logic)
```

---

## Dependencies (DA CAI — khong can pnpm add)

> T1: Liet ke npm packages da co san trong project.
> Neu T2/T3 can package chua co → HOI user truoc.

```
- bcrypt, @types/bcrypt
- passport, @nestjs/passport
- class-validator, class-transformer
- (them packages da cai)
```

---

## RULES

1. **KHONG import** module/function chua co trong contracts nay
2. **KHONG tao file** ngoai danh sach "New Files"
3. **KHONG cai package** moi ma khong hoi user
4. **KHONG thay doi** database schema (schema.prisma)
5. **Neu can gi chua co** trong contracts → HOI user, KHONG tu bia
6. **Doc file thuc te** truoc khi sua — giu lai code dung, chi bo sung

---

*Created: YYYY-MM-DD*
