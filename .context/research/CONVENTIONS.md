# Coding Conventions

> Quy uoc chung cho toan project DevTeamOS.

---

## Naming Conventions

### Backend (NestJS / TypeScript)

| Loai | Convention | Vi du |
|------|-----------|-------|
| File name | kebab-case | `auth.controller.ts`, `jwt-auth.guard.ts` |
| Class name | PascalCase | `AuthController`, `JwtAuthGuard` |
| Method name | camelCase | `findById()`, `createUser()` |
| Variable | camelCase | `accessToken`, `refreshToken` |
| Constant | UPPER_SNAKE_CASE | `JWT_EXPIRES_IN`, `MAX_FILE_SIZE` |
| DTO class | PascalCase + Dto suffix | `RegisterDto`, `LoginDto` |
| Interface | PascalCase + prefix/context | `JwtPayload`, `GoogleProfile` |
| Enum | PascalCase (values: UPPER_SNAKE_CASE) | `TaskStatus.IN_PROGRESS` |
| Database field | camelCase (Prisma convention) | `createdAt`, `workspaceId` |

### Frontend (React / TypeScript)

| Loai | Convention | Vi du |
|------|-----------|-------|
| Component file | PascalCase.tsx | `LoginPage.tsx`, `TaskCard.tsx` |
| Hook file | camelCase.ts | `useSocket.ts`, `useAuth.ts` |
| Store file | kebab-case.store.ts | `auth.store.ts`, `theme.store.ts` |
| Service file | kebab-case.ts | `api.ts`, `socket.ts` |
| CSS class | kebab-case (Tailwind) | `btn-primary`, `card-header` |

---

## Import Order

Thu tu import trong moi file:

```typescript
// 1. Built-in / Node.js modules
import { join } from 'path';

// 2. External packages (npm)
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// 3. Internal modules (absolute imports)
import { AuthService } from '@/modules/auth/auth.service';

// 4. Relative imports
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

// 5. Type imports
import type { Request, Response } from 'express';
```

---

## Error Handling

### Backend — HTTP Exceptions

| Truong hop | HTTP Status | NestJS Exception |
|------------|-------------|------------------|
| Validation fail (DTO) | 400 Bad Request | Auto boi ValidationPipe |
| Chua dang nhap | 401 Unauthorized | `UnauthorizedException` |
| Khong co quyen | 403 Forbidden | `ForbiddenException` |
| Khong tim thay | 404 Not Found | `NotFoundException` |
| Trung lap (email, slug...) | 409 Conflict | `ConflictException` |
| Loi server | 500 Internal Server Error | De NestJS tu xu ly hoac `InternalServerErrorException` |

### Error response format (NestJS default)

```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### Frontend — Error handling

- API errors: catch trong Axios interceptor → show toast notification
- Form errors: React Hook Form + Zod validation → inline error messages
- Page-level errors: Error boundary component → fallback UI
- Network errors: TanStack Query `onError` → retry + toast

---

## API Response Format

### Success response

```json
{
  "id": "clxx...",
  "email": "user@example.com",
  "name": "User Name",
  "createdAt": "2026-02-27T10:00:00.000Z"
}
```

> Tra ve data truc tiep, KHONG wrap trong `{ data: ... }` hay `{ success: true, data: ... }`.
> NestJS default behavior — giu don gian.

### List response (co pagination)

```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### Error response (NestJS default)

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

---

*Last updated: 2026-02-27*
