---
name: api-endpoint
description: Generate a single API endpoint with controller method, service method, and DTO. Use when adding new endpoints to existing modules.
---

# Generate API Endpoint

Create a single API endpoint within an existing NestJS module.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Endpoint description (e.g., "GET /tasks/:id", "POST /projects create project")

## Pre-flight (BAT BUOC)

Truoc khi bat dau, DOC cac file sau:
1. `.context/research/CONVENTIONS.md` — naming, error handling, API response format
2. `.context/research/PITFALLS.md` — cam bay NestJS, Prisma
3. `apps/api/prisma/schema.prisma` — confirm model/fields ton tai
4. Module hien tai: doc `*.controller.ts` + `*.service.ts` cua module target
5. Existing imports: confirm guards, decorators, services ton tai

## Instructions

When the user runs `/api-endpoint <description>`:

### Step 1: Clarify Requirements
Ask user:
1. "Endpoint này thuộc module nào?" (auth, users, workspaces, projects, tasks...)
2. "HTTP method nào?" (GET, POST, PATCH, DELETE)
3. "Cần authentication không?" (public hay protected)
4. "Input/Output data như thế nào?"

### Step 2: Read Existing Code (KHONG SKIP)
```
DOC truoc khi code:
1. apps/api/src/modules/[module]/[module].controller.ts — xem endpoints da co
2. apps/api/src/modules/[module]/[module].service.ts — xem methods da co
3. apps/api/prisma/schema.prisma — confirm model ton tai
```

### Step 3: Show Plan
```
Plan for endpoint: [METHOD] /api/[path]

Files to modify:
1. apps/api/src/modules/[module]/[module].controller.ts
2. apps/api/src/modules/[module]/[module].service.ts
3. apps/api/src/modules/[module]/dto/[action].dto.ts (if needed)

Authentication: [Yes/No]
Imports verified: [list imports da confirm ton tai]
```

Ask: "Bạn confirm kế hoạch này không?"

### Step 4: Create DTO (if needed)
```typescript
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class [Action]Dto {
  @ApiProperty({ description: '...' })
  @IsString()
  field: string;
}
```

### Step 5: Add Service Method
```typescript
async [methodName](dto: [Action]Dto): Promise<[ReturnType]> {
  return this.prisma.[model].[operation]({ ... });
}
```

### Step 6: Add Controller Method
```typescript
@[Method]('[path]')
@ApiOperation({ summary: '...' })
async [methodName](@Body() dto: [Action]Dto) {
  return this.service.[methodName](dto);
}
```

## Code Standards

1. **Route naming**: RESTful conventions (GET /items, POST /items, PATCH /items/:id, DELETE /items/:id)

2. **Authentication**: Use guards from `../../common/guards/`
   ```typescript
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth()
   ```

3. **Error handling**: NestJS exceptions (400 auto, 401 Unauthorized, 403 Forbidden, 404 NotFound, 409 Conflict)

4. **Response**: Tra ve data truc tiep, KHONG wrap `{ data: ... }`

## Existing Modules

| Module | Status | Logic |
|--------|--------|-------|
| `auth/` | ACTIVE | register, login, JWT, refresh, OAuth, email verify |
| `users/` | ACTIVE | profile CRUD, change password, avatar upload |
| `email/` | ACTIVE | Nodemailer |
| `workspaces/` | SKELETON | empty |
| `projects/` | SKELETON | empty |
| `tasks/` | SKELETON | empty |
| `comments/` | SKELETON | empty |
| `notifications/` | SKELETON | empty |
| `files/` | SKELETON | empty |

## After Completion

Remind user:
- "Test endpoint bằng Swagger UI: http://localhost:3000/api/docs"
- "Nhớ update PROGRESS.md!"
