---
paths:
  - "apps/api/prisma/**"
  - "**/*.prisma"
---

# Prisma Deep Patterns

> Tu dong load khi lam viec voi Prisma files. Bo sung cho prisma.md co ban.

## Migration Workflow

```bash
# 1. Sua schema.prisma
# 2. Tao migration
pnpm --filter api prisma migrate dev --name ten_migration

# 3. Generate client (tu dong sau migrate, nhung chay manual neu can)
pnpm --filter api prisma generate

# 4. Verify
pnpm --filter api prisma studio
```

**Naming migrations:** kebab-case, mo ta ngan — `add-workspace-model`, `add-task-status-enum`

## Relation Patterns

### One-to-Many (parent co nhieu children)
```prisma
model Workspace {
  id       String    @id @default(cuid())
  projects Project[]  // array = "nhieu"
}

model Project {
  id          String    @id @default(cuid())
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  workspaceId String
}
```

### Many-to-Many (qua junction table)
```prisma
model Task {
  id        String         @id @default(cuid())
  assignees TaskAssignee[]
}

model TaskAssignee {
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  taskId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
  @@id([taskId, userId])  // composite primary key
}
```

## Query Optimization

### Tranh N+1 — dung include/select
```typescript
// BAD — N+1
const tasks = await prisma.task.findMany();
for (const task of tasks) {
  task.assignees = await prisma.taskAssignee.findMany({ where: { taskId: task.id } });
}

// GOOD — 1 query
const tasks = await prisma.task.findMany({
  include: { assignees: { include: { user: { select: { id: true, name: true } } } } },
});
```

### Select chi fields can thiet
```typescript
// Tranh tra ve password hash, tokens...
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true, avatar: true },
});
```

## Index Strategy

```prisma
model Task {
  // ... fields
  @@index([workspaceId])          // filter by workspace
  @@index([projectId, status])    // filter tasks in project by status
  @@index([assigneeId, status])   // my tasks filtered by status
}
```

**Khi nao them index:**
- Fields thuong dung trong `where` clause
- Fields dung trong `orderBy`
- Foreign keys (Prisma tu tao cho relations, nhung composite filters can manual index)

## Soft Delete Pattern (neu can sau nay)

```prisma
model Project {
  deletedAt DateTime?  // null = active, co gia tri = deleted

  @@index([workspaceId, deletedAt])
}
```

```typescript
// Query chi active records
const projects = await prisma.project.findMany({
  where: { workspaceId, deletedAt: null },
});
```

## Enum Best Practices

- Dinh nghia trong schema.prisma, Prisma generate TypeScript enum tuong ung
- Import tu `@prisma/client` trong code: `import { TaskStatus } from '@prisma/client'`
- KHONG tao enum rieng trong TypeScript — dung Prisma-generated enum
