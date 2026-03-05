# 00-chore-foundation - TODO

## Prisma Schema
- [ ] Dinh nghia tat ca models (User, RefreshToken, Workspace, WorkspaceMember, WorkspaceInvitation, Project, Task, TaskAssignee, ChecklistItem, Attachment, Comment, Notification)
- [ ] Dinh nghia tat ca enums (AuthProvider, Theme, Role, Plan, TaskStatus, Priority, ProjectStatus, NotificationType)
- [ ] Thiet lap relations giua cac models
- [ ] Chay `npx prisma migrate dev` thanh cong
- [ ] Chay `npx prisma generate` thanh cong

## Environment
- [ ] Tao `apps/api/.env.example` voi tat ca variables
- [ ] Tao `apps/web/.env.example` voi tat ca variables
- [ ] Kiem tra `docker compose up -d` chay OK (PostgreSQL port 5433)

## Shared Types
- [ ] Tao types co ban trong `packages/shared/src/types.ts`
- [ ] Export enums dung chung (TaskStatus, Priority, Role, etc.)

## CLAUDE.md
- [ ] Them quy uoc branch workflow
- [ ] Them quy uoc commit message (conventional commits)
- [ ] Them huong dan agent doc CONTEXT.md
