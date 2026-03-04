---
name: prisma-model
description: Generate Prisma model with proper relations and run migration. Use when adding new database models.
---

# Generate Prisma Model

Create a Prisma model with proper TypeScript types, relations, and migration.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Model name (e.g., "Task", "Project", "Comment")

## Pre-flight (BAT BUOC)

Truoc khi tao model, DOC:
1. `apps/api/prisma/schema.prisma` — xem models + enums da co, tranh trung lap
2. `.context/ARCHITECTURE.md` > Database Schema — key relationships
3. `.context/research/PITFALLS.md` > Prisma section — cam bay
4. `.context/research/CONVENTIONS.md` — naming conventions

## Instructions

When the user runs `/prisma-model <ModelName>`:

### Step 1: Read schema (KHONG SKIP)
```
DOC: apps/api/prisma/schema.prisma
- Xem models da co
- Xem enums da co
- Xem naming patterns
```

### Step 2: Gather requirements
Ask user:
1. "Model này cần những fields nào?"
2. "Có relations với models khác không?" (User, Workspace, Project, Task...)

### Step 3: Show plan before creating
```
Plan for model: <ModelName>

Fields:
- id: String @id @default(cuid())
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
- [other fields...]

Relations:
- belongsTo [Model]

Existing enums to reuse: [list]
```

Ask: "Bạn có muốn thêm/bớt field nào không?"

### Step 4: Add model to schema + Explain + Run migration

## Naming Conventions

- Model: PascalCase — `User`, `WorkspaceMember`
- Fields: camelCase — `createdAt`, `workspaceId`
- Enums: PascalCase, values UPPER_SNAKE_CASE — `TaskStatus.IN_PROGRESS`

## Existing Enums (KHONG tao trung lap)

AuthProvider, Theme, Role, TaskStatus, Priority, ProjectStatus, Plan, NotificationType

## Key Relationships

```
User -> WorkspaceMember -> Workspace (multi-tenant)
Workspace -> Project -> Task (hierarchy)
Task -> Task (self-ref, 2 levels max)
```

## Pitfalls

- LUON `npx prisma generate` sau khi sua schema
- Dung `include: {}` tranh N+1
- DateTime luu UTC, convert o frontend
- `onDelete: Cascade` cho child records

## After Completion

Remind user:
- "Nhớ update PROGRESS.md!"
- "Muốn tạo NestJS module? → `/nest-module`"
