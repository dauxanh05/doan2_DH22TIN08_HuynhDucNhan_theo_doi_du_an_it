---
name: api-endpoint
description: Generate a single API endpoint with controller method, service method, and DTO. Use when adding new endpoints to existing modules.
---

# Generate API Endpoint

Create a single API endpoint within an existing NestJS module.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Endpoint description (e.g., "GET /tasks/:id", "POST /projects create project")

## Instructions

When the user runs `/api-endpoint <description>`:

### Step 1: Clarify Requirements
Ask user:
1. "Endpoint này thuộc module nào?" (tasks, projects, workspaces, etc.)
2. "HTTP method nào?" (GET, POST, PATCH, DELETE)
3. "Cần authentication không?" (public hay protected)
4. "Input/Output data như thế nào?"

### Step 2: Show Plan
```
📋 Plan for endpoint: [METHOD] /api/[path]

Files to modify:
1. apps/api/src/modules/[module]/[module].controller.ts
2. apps/api/src/modules/[module]/[module].service.ts
3. apps/api/src/modules/[module]/dto/[action].dto.ts (if needed)

Authentication: [Yes/No]
```

Ask: "Bạn confirm kế hoạch này không?"

### Step 3: Create DTO (if needed)
```typescript
// dto/[action].dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class [Action]Dto {
  @ApiProperty({ description: '...' })
  @IsString()
  field: string;
}
```

### Step 4: Add Service Method
```typescript
async [methodName](dto: [Action]Dto): Promise<[ReturnType]> {
  return this.prisma.[model].[operation]({ ... });
}
```

### Step 5: Add Controller Method
```typescript
@[Method]('[path]')
@ApiOperation({ summary: '...' })
async [methodName](@Body() dto: [Action]Dto) {
  return this.service.[methodName](dto);
}
```

## Code Standards

1. **Route naming**: RESTful conventions
   - GET /items - List all
   - GET /items/:id - Get one
   - POST /items - Create
   - PATCH /items/:id - Update
   - DELETE /items/:id - Delete

2. **Authentication**: Use guards
   ```typescript
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth()
   ```

3. **Error handling**: Use NestJS exceptions
   ```typescript
   throw new NotFoundException('Task not found');
   throw new ForbiddenException('Not allowed');
   ```

## Example Usage

```
/api-endpoint GET /tasks/:id - get task by id
/api-endpoint POST /projects - create new project
/api-endpoint PATCH /workspaces/:id - update workspace
```

## After Completion

Remind user:
- "Test endpoint bằng Swagger UI: http://localhost:3000/api/docs"
- "Nhớ update PROGRESS.md!"
