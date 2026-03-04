---
paths:
  - "apps/api/**/*.ts"
---

# Backend Rules (NestJS)

## Module Pattern

- Moi domain = 1 module: `*.module.ts`, `*.controller.ts`, `*.service.ts`
- Controllers CHI handle HTTP requests, delegate logic cho services
- Services chua business logic, inject PrismaService
- API prefix: `/api`, Swagger: `/api/docs`

## Service Injection

```typescript
@Injectable()
export class XxxService {
  constructor(private prisma: PrismaService) {}
}
```

- LUON inject qua constructor
- PrismaService la global module, khong can import PrismaModule trong moi module

## DTO Validation

- Dung `class-validator` decorators: @IsString, @IsEmail, @MinLength, @IsNotEmpty
- Dung `@ApiProperty()` cho Swagger docs
- File dat trong `dto/` subfolder: `create-xxx.dto.ts`, `update-xxx.dto.ts`
- ValidationPipe da enable global trong main.ts

## Error Handling

| Truong hop | Exception |
|------------|-----------|
| Validation fail | Auto (ValidationPipe) |
| Chua dang nhap | `UnauthorizedException` |
| Khong co quyen | `ForbiddenException` |
| Khong tim thay | `NotFoundException` |
| Trung lap | `ConflictException` |

- KHONG catch loi roi tra ve custom format — de NestJS xu ly
- KHONG dung try-catch bao quanh toan bo method — chi catch specific cases

## Auth Guard

```typescript
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Get('endpoint')
async method(@CurrentUser() user: User) {}
```

- Import guard tu: `../../common/guards/jwt-auth.guard.ts`
- Import decorator tu: `../../common/decorators/current-user.decorator.ts`

## API Response

- Tra ve data truc tiep, KHONG wrap trong `{ data: ... }` hay `{ success: true }`
- List co pagination: `{ data: [...], total, page, limit }`

## Existing Modules (cap nhat khi them module moi)

- `auth/` — ACTIVE: register, login, JWT, refresh, OAuth, email verify
- `users/` — ACTIVE: profile CRUD, change password, avatar upload
- `email/` — ACTIVE: Nodemailer send verify + reset emails
- `workspaces/` — SKELETON
- `projects/` — SKELETON
- `tasks/` — SKELETON
- `comments/` — SKELETON
- `notifications/` — SKELETON
- `files/` — SKELETON
