---
name: prisma-model
description: Generate Prisma model with proper relations and run migration. Use when adding new database models.
---

# Generate Prisma Model

Create a Prisma model with proper TypeScript types, relations, and migration.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Model name (e.g., "Task", "Project", "Comment")

## Instructions

When the user runs `/prisma-model <ModelName>`:

### Step 1: Gather requirements
Ask user:
1. "Model này cần những fields nào?"
2. "Có relations với models khác không?" (User, Workspace, Project, Task...)

### Step 2: Show plan before creating
```
📋 Plan for model: <ModelName>

Fields:
- id: String @id @default(cuid())
- createdAt: DateTime @default(now())
- updatedAt: DateTime @updatedAt
- [other fields...]

Relations:
- belongsTo User
- belongsTo Workspace

Location: apps/api/prisma/schema.prisma
```

Ask: "Bạn có muốn thêm/bớt field nào không?"

### Step 3: Add model to schema
Edit `apps/api/prisma/schema.prisma` with:
- Model definition
- Proper field types
- Relations with other models
- Indexes if needed

### Step 4: Explain the model
After adding, explain:
1. **Fields** - What each field is for
2. **Relations** - How it connects to other models
3. **Decorators** - @id, @default, @relation, etc.

### Step 5: Run migration
Ask: "Bạn muốn tôi chạy migration luôn không?"

If yes:
```bash
cd apps/api
npx prisma migrate dev --name add_<model_name>
```

## Prisma Best Practices

1. **Naming**:
   - Model names: PascalCase (User, Project, Task)
   - Field names: camelCase (createdAt, userId)

2. **Common field patterns**:
   ```prisma
   id        String   @id @default(cuid())
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
   ```

3. **Relations**:
   ```prisma
   // One-to-Many
   user   User   @relation(fields: [userId], references: [id])
   userId String
   ```

## Existing Models Reference

DevTeamOS uses these enums:
- `TaskStatus`: TODO, IN_PROGRESS, DONE
- `Priority`: URGENT, HIGH, MEDIUM, LOW
- `Role`: OWNER, ADMIN, MEMBER, VIEWER

Key relationships:
- User → WorkspaceMember → Workspace
- Workspace → Project → Task
- Task → Task (subtasks, 2 levels max)

## After Completion

Remind user:
- "Nhớ update PROGRESS.md!"
- Suggest: "Bạn có muốn tạo NestJS module cho model này không? (`/nest-module`)"
- Run `npx prisma studio` to view in GUI
