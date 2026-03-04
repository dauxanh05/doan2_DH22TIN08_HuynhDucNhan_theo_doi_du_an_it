---
name: nest-module
description: Generate a complete NestJS module with controller, service, and DTOs following DevTeamOS architecture. Use when creating new backend modules.
---

# Generate NestJS Module

Generate a complete NestJS module following DevTeamOS project architecture.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Module name (e.g., "workspaces", "projects", "tasks")

## Pre-flight (BAT BUOC)

Truoc khi tao module, DOC:
1. `.context/research/CONVENTIONS.md` — naming, imports, error handling
2. `.context/research/PITFALLS.md` — NestJS cam bay
3. `.context/codebase/CONVENTIONS.md` — patterns dang dung trong code
4. `apps/api/prisma/schema.prisma` — confirm model ton tai
5. `apps/api/src/app.module.ts` — xem modules da registered
6. `apps/api/src/modules/auth/` — reference module ACTIVE de follow pattern

## Instructions

When the user runs `/nest-module <module-name>`:

### Step 1: Read existing code (KHONG SKIP)
```
DOC truoc:
1. apps/api/src/app.module.ts — modules da co
2. apps/api/src/modules/auth/auth.module.ts — reference pattern
3. apps/api/src/modules/auth/auth.service.ts — reference PrismaService injection
4. apps/api/prisma/schema.prisma — confirm model
```

### Step 2: Plan & Confirm
Show user what will be created:
```
apps/api/src/modules/<module-name>/
├── <module-name>.module.ts
├── <module-name>.controller.ts
├── <module-name>.service.ts
├── dto/
│   ├── create-<module-name>.dto.ts
│   └── update-<module-name>.dto.ts
```

Ask: "Bạn muốn bắt đầu từ file nào? Recommend: Service (chứa core logic)"

### Step 3: Create files one by one
For EACH file:
1. Write the code (max 50 lines)
2. Verify all imports exist in codebase
3. Explain what it does and WHY
4. Ask: "Bạn hiểu phần này chưa?"
5. Wait for confirmation before next file

## Code Standards

1. **Controller**: `@Controller('module-name')` — API prefix /api da co san
2. **Service**: `constructor(private prisma: PrismaService) {}` — import from `../../prisma/prisma.service`
3. **Guards**: import from `../../common/guards/jwt-auth.guard` + `../../common/decorators/current-user.decorator`
4. **DTOs**: class-validator + @ApiProperty

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
- "Nhớ register module trong AppModule!"
- "Nhớ update `.context/codebase/STRUCTURE.md`!"
- "Nhớ update PROGRESS.md!"
