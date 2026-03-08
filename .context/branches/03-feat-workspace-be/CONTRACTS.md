# CONTRACTS — Branch 03-feat-workspace-be

> T2 PHAI doc file nay TRUOC khi code. Follow CHINH XAC.

---

## Existing Imports (VERIFIED — ko tu bia)

### From @nestjs/common
```
Injectable, Controller, Module, Get, Post, Patch, Delete,
Body, Param, HttpCode, HttpStatus, UseGuards,
ForbiddenException, NotFoundException, ConflictException, BadRequestException,
CanActivate, ExecutionContext, SetMetadata
```

### From @nestjs/swagger
```
ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, PartialType, ApiProperty
```

### From @nestjs/core
```
Reflector
```

### From class-validator
```
IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum,
MinLength, MaxLength, Matches
```

### From @prisma/client
```
Role (enum: OWNER, ADMIN, MEMBER, VIEWER)
Plan (enum: FREE, STARTER, PROFESSIONAL)
```

### From project (verified paths)

| Import | Path | Note |
|--------|------|------|
| PrismaService | `@/prisma/prisma.service` | Global module, ko can import PrismaModule |
| JwtAuthGuard | `@/common/guards/jwt-auth.guard` | AuthGuard('jwt') |
| CurrentUser | `@/common/decorators/current-user.decorator` | Extract user tu request |
| JwtUser | `../../modules/auth/interfaces/jwt-payload.interface` | `{ id: string; email: string }` |
| EmailService | inject truc tiep | Global module (EmailModule), ko can import |
| ConfigService | `@nestjs/config` | Global module, ko can import |

---

## Database Models (tu schema.prisma — KHONG sua schema)

### Workspace
```prisma
model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  logo      String?
  plan      Plan     @default(FREE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members     WorkspaceMember[]
  projects    Project[]
  invitations WorkspaceInvitation[]
  activities  Activity[]
}
```

### WorkspaceMember
```prisma
model WorkspaceMember {
  id          String   @id @default(cuid())
  userId      String
  workspaceId String
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}
```

### WorkspaceInvitation
```prisma
model WorkspaceInvitation {
  id          String   @id @default(cuid())
  workspaceId String
  email       String
  role        Role     @default(MEMBER)
  token       String   @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, email])
}
```

---

## Patterns to Follow (tu auth module)

### Controller pattern (tu auth.controller.ts)
```typescript
@ApiTags('Workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(userId, dto);
  }
}
```

### Service pattern (tu workspaces.service.ts skeleton)
```typescript
@Injectable()
export class WorkspacesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}
}
```

### DTO pattern (tu register.dto.ts)
```typescript
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({ example: 'My Team', description: 'Workspace name' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
```

### Error handling
- Dung NestJS exceptions truc tiep: ConflictException, ForbiddenException, NotFoundException, BadRequestException
- KHONG try-catch bao quanh toan bo method
- Response tra ve data truc tiep, KHONG wrap `{ data: ... }`

### EmailService usage (tu email.service.ts)
```typescript
await this.emailService.sendMail(email, subject, htmlContent);
// sendMail(to: string, subject: string, html: string): Promise<void>
```

---

## API Response Contracts

### POST /workspaces → 201
```json
{
  "id": "cuid",
  "name": "My Team",
  "slug": "my-team",
  "logo": null,
  "plan": "FREE",
  "createdAt": "ISO",
  "updatedAt": "ISO"
}
```

### GET /workspaces → 200
```json
[
  {
    "id": "cuid",
    "name": "My Team",
    "slug": "my-team",
    "logo": null,
    "plan": "FREE",
    "role": "OWNER",
    "createdAt": "ISO",
    "updatedAt": "ISO"
  }
]
```

### GET /workspaces/:id → 200
```json
{
  "id": "cuid",
  "name": "My Team",
  "slug": "my-team",
  "logo": null,
  "plan": "FREE",
  "createdAt": "ISO",
  "updatedAt": "ISO",
  "members": [
    {
      "id": "cuid",
      "userId": "cuid",
      "role": "OWNER",
      "joinedAt": "ISO",
      "user": { "id": "cuid", "name": "Name", "email": "email", "avatar": null }
    }
  ]
}
```

### GET /workspaces/:id/members → 200
```json
[
  {
    "id": "cuid",
    "userId": "cuid",
    "workspaceId": "cuid",
    "role": "OWNER",
    "joinedAt": "ISO",
    "user": { "id": "cuid", "name": "Name", "email": "email", "avatar": null }
  }
]
```

### POST /workspaces/:id/invite → 200
```json
{ "message": "Invitation sent successfully" }
```

### POST /workspaces/join/:token → 200
```json
{ "message": "Joined workspace successfully", "workspaceId": "cuid" }
```

### DELETE /workspaces/:id/members/:userId → 200
```json
{ "message": "Member removed successfully" }
```

---

## Error Contracts (tu specs)

| Case | Status | Message |
|------|--------|---------|
| Slug da ton tai | 409 | `Workspace slug already exists` |
| Ko phai OWNER khi xoa ws | 403 | `Insufficient permissions` (guard) |
| Ko phai member | 403 | `Not a member of this workspace` |
| Email da la member | 409 | `User is already a member` |
| Email da duoc moi | 409 | `Invitation already sent` |
| Token het han | 400 | `Invitation expired` |
| Token sai | 404 | `Invitation not found` |
| Xoa OWNER | 403 | `Cannot remove workspace owner` |
| Doi role OWNER | 403 | `Cannot change owner role` |
| Workspace ko ton tai | 404 | `Workspace not found` |
