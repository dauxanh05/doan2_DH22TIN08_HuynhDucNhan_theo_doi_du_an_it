# 00-chore-foundation - Context

> **Loai:** chore | **Phu thuoc:** khong co (nhanh dau tien)

## Reference
- `context/overview.md` - Tong quan du an, tech stack, cau truc monorepo
- `CLAUDE.md` - Project guidelines
- `apps/api/prisma/schema.prisma` - Schema hien tai

## Scope

Nhanh nay setup toan bo foundation cho du an truoc khi bat dau code features.

### 1. Prisma Schema
Hoan thien toan bo database schema bao gom:
- **User** - email, password, name, avatar, provider, theme, emailVerified
- **RefreshToken** - token hash, userId, expiresAt (them moi)
- **Workspace** - name, slug, logo, plan
- **WorkspaceMember** - userId, workspaceId, role
- **WorkspaceInvitation** - email, token, role, expiresAt
- **Project** - workspaceId, name, description, color, icon, status
- **Task** - projectId, parentId, title, description, status, priority, position, dueDate
- **TaskAssignee** - taskId, userId
- **ChecklistItem** - taskId, title, completed, position
- **Attachment** - taskId, filename, path, mimetype, size
- **Comment** - taskId, userId, content, mentions[]
- **Notification** - userId, type, title, message, data, read
- Tat ca Enums: AuthProvider, Theme, Role, Plan, TaskStatus, Priority, ProjectStatus, NotificationType

### 2. Environment
- Tao `.env.example` cho `apps/api/` va `apps/web/`
- Kiem tra `docker-compose.yml` chay dung (PostgreSQL port 5433)

### 3. Shared Types
- Tao types co ban trong `packages/shared/src/types.ts`
- Export enums va interfaces dung chung giua BE va FE

### 4. CLAUDE.md Update
- Them quy uoc branch workflow
- Them quy uoc commit message
- Them huong dan cho agent doc CONTEXT.md truoc khi lam

## Rules
- Chay `npx prisma migrate dev` sau khi hoan thien schema
- Chay `npx prisma generate` de tao Prisma Client
- Dam bao `docker compose up -d` chay OK truoc khi migrate
