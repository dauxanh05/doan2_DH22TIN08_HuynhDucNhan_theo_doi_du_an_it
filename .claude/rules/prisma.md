---
paths:
  - "**/*.prisma"
  - "apps/api/prisma/**"
---

# Prisma Rules

## Naming

- Model names: PascalCase — `User`, `WorkspaceMember`, `Task`
- Field names: camelCase — `createdAt`, `workspaceId`, `userId`
- Enum names: PascalCase, values: UPPER_SNAKE_CASE — `TaskStatus.IN_PROGRESS`

## Common Fields (moi model)

```prisma
id        String   @id @default(cuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

## Relations

```prisma
// One-to-Many (child side)
user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
userId String

// Self-referential (Task -> Subtask, max 2 levels)
parent   Task?   @relation("Subtasks", fields: [parentId], references: [id])
parentId String?
subtasks Task[]  @relation("Subtasks")
```

## Existing Enums

- `AuthProvider`: LOCAL, GOOGLE
- `Theme`: LIGHT, DARK, SYSTEM
- `Role`: OWNER, ADMIN, MEMBER, VIEWER
- `TaskStatus`: TODO, IN_PROGRESS, DONE
- `Priority`: URGENT, HIGH, MEDIUM, LOW
- `ProjectStatus`: ACTIVE, COMPLETED, ARCHIVED
- `Plan`: FREE, STARTER, PROFESSIONAL
- `NotificationType`: TASK_ASSIGNED, TASK_UPDATED, ...

## Key Relationships

```
User -> WorkspaceMember -> Workspace    (multi-tenant)
Workspace -> Project -> Task            (hierarchy)
Task -> Task                            (self-ref, 2 levels max)
Task -> TaskAssignee, Comment, ChecklistItem, Attachment
```

## Pitfalls

- LUON chay `npx prisma generate` sau khi sua schema
- Dung `include: {}` thay vi loop query (tranh N+1)
- DateTime luu UTC, convert timezone o frontend
- Khong de tich nhieu schema changes — migrate thuong xuyen
