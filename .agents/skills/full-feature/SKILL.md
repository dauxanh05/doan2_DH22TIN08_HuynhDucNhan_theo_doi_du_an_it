---
name: full-feature
description: Generate a complete feature end-to-end including Prisma model, NestJS module, React components, and API hooks. Use for new features spanning backend and frontend.
---

# Generate Full Feature

Create a complete feature from database to UI in one guided workflow.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Feature name (e.g., "comments", "attachments", "labels")

## Instructions

When the user runs `/full-feature <name>`:

### Step 1: Feature Planning
Ask user to describe the feature:
1. "Feature này làm gì?"
2. "User stories?"
3. "Cần những data gì?"

### Step 2: Show Full Plan
```
📋 Full Feature Plan: [Name]

🗄️ DATABASE (Prisma)
- Model: [Name]
- Location: apps/api/prisma/schema.prisma

⚙️ BACKEND (NestJS)
- Module: apps/api/src/modules/[name]/
- Controller, Service, DTOs

🎨 FRONTEND (React)
- Components: apps/web/src/features/[name]/
- Hooks: apps/web/src/hooks/

📝 ORDER:
1. Prisma Model → Migration
2. NestJS Module → Test với Swagger
3. React Hooks → Test fetch
4. React Components → Complete UI
```

### Step 3: Execute Step by Step

#### Phase 1: Database
```
→ Sử dụng: /prisma-model [Name]
```
**Checkpoint:** "Database ready! Tiếp tục?"

#### Phase 2: Backend
```
→ Sử dụng: /nest-module [name]
```
**Checkpoint:** "API ready! Test OK chưa?"

#### Phase 3: API Hooks
```
→ Sử dụng: /react-query-hook useGet[Name]s
→ Sử dụng: /react-query-hook useCreate[Name]
```
**Checkpoint:** "Hooks ready! Tiếp tục?"

#### Phase 4: UI Components
```
→ Sử dụng: /react-component [Name]Card feature
→ Sử dụng: /react-component [Name]List feature
```
**Checkpoint:** "UI ready! Feature complete!"

### Step 4: Integration Testing
Test full flow:
1. Create → Check in DB
2. List → Verify display
3. Update → Check changes
4. Delete → Verify removal

## Feature Checklist

### Backend
- [ ] Prisma model created
- [ ] Migration applied
- [ ] CRUD endpoints working
- [ ] Authentication/Authorization

### Frontend
- [ ] API hooks created
- [ ] Components render correctly
- [ ] Loading/Error states handled

## Example Features

```
/full-feature comments
/full-feature attachments
/full-feature labels
```

## After Completion

Remind user:
- "Feature complete! 🎉"
- "Commit: `feat([name]): add [name] feature`"
- "Update PROGRESS.md"
