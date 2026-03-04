---
name: full-feature
description: Generate a complete feature end-to-end including Prisma model, NestJS module, React components, and API hooks. Use for new features spanning backend and frontend.
---

# Generate Full Feature

Create a complete feature from database to UI in one guided workflow.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Feature name (e.g., "comments", "attachments", "labels")

## Pre-flight (BAT BUOC)

Truoc khi bat dau, DOC:
1. `.context/ARCHITECTURE.md` — hieu tong quan architecture
2. `.context/research/CONVENTIONS.md` — coding conventions
3. `.context/research/PITFALLS.md` — cam bay can tranh
4. `apps/api/prisma/schema.prisma` — xem models da co
5. `.context/specs/` — xem co spec cho feature nay khong

## Instructions

When the user runs `/full-feature <name>`:

### Step 1: Feature Planning
Ask user:
1. "Feature này làm gì?"
2. "User stories?"
3. "Cần những data gì?"

Check `.context/specs/` for existing spec. If found, follow spec.

### Step 2: Show Full Plan
```
Full Feature Plan: [Name]

DATABASE (Prisma)
- Model: [Name]
- Location: apps/api/prisma/schema.prisma

BACKEND (NestJS)
- Module: apps/api/src/modules/[name]/
- Controller, Service, DTOs

FRONTEND (React)
- Components: apps/web/src/features/[name]/
- Hooks: apps/web/src/hooks/

ORDER:
1. Prisma Model → Migration
2. NestJS Module → Test với Swagger
3. React Hooks → Test fetch
4. React Components → Complete UI
```

### Step 3: Execute Step by Step

#### Phase 1: Database
Dung `/prisma-model` skill hoac lam thu cong.
**Checkpoint:** "Database ready! Tiếp tục?"

#### Phase 2: Backend
Dung `/nest-module` + `/api-endpoint` skills.
**Checkpoint:** "API ready! Test OK chưa?"

#### Phase 3: API Hooks
Dung `/react-query-hook` skill.
**Checkpoint:** "Hooks ready! Tiếp tục?"

#### Phase 4: UI Components
Dung `/react-component` skill.
**Checkpoint:** "UI ready! Feature complete!"

### Step 4: Integration Testing
1. Create → Check in DB
2. List → Verify display
3. Update → Check changes
4. Delete → Verify removal

## Anti-Hallucination

- MOI phase: doc code da tao o phase truoc
- Phase 2 (Backend): doc schema.prisma da tao o Phase 1
- Phase 3 (Hooks): doc controller endpoints da tao o Phase 2
- Phase 4 (UI): doc hooks da tao o Phase 3
- KHONG gia dinh — LUON doc code thuc te

## After Completion

Remind user:
- "Feature complete!"
- "Commit: `feat([name]): add [name] feature`"
- "Update PROGRESS.md + STRUCTURE.md"
