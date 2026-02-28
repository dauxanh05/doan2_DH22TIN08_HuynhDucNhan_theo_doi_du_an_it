# Workflow: DevTeamOS

---

## Branch Strategy

- **Main branch**: Planning & review only, KHONG code truc tiep tren main
- **Merge flow tuan tu**: `00-chore-foundation` -> `main` -> `01-feat-auth-be` -> `main` -> ...
- Moi nhanh merge xong ve main roi nhanh tiep theo moi branch tu main

## Branches

| # | Branch | Type | Scope |
|---|--------|------|-------|
| 00 | `00-chore-foundation` | chore | Prisma schema, .env, Docker, Shared types, CLAUDE.md |
| 01 | `01-feat-auth-be` | feat | Register, Login, JWT, Refresh, Google OAuth, Email Verify, Forgot/Reset PW |
| 02 | `02-feat-auth-fe` | feat | LoginPage, RegisterPage, ForgotPW, auth.store, ProtectedRoute |
| 03 | `03-feat-workspace-be` | feat | Workspace CRUD, Members, Invitation, Role Guard |
| 04 | `04-feat-workspace-fe` | feat | WorkspaceList, Settings, Members, Switcher |
| 05 | `05-feat-project-task-be` | feat | Project + Task CRUD, Subtasks, Checklist, Attachments, File upload |
| 06 | `06-feat-project-task-fe` | feat | ProjectList, ProjectDetail, TaskDetailModal |
| 07 | `07-feat-ai-be` | feat | 4 AI endpoints (split-task, analyze, assign, code-assist) |
| 08 | `08-feat-ai-fe` | feat | 4 AI components |
| 09 | `09-feat-kanban-fe` | feat | KanbanBoard, @dnd-kit drag-drop, Reorder API (FE-only) |
| 10 | `10-feat-realtime-be` | feat | Comments, Notifications, WebSocket Gateway |
| 11 | `11-feat-realtime-fe` | feat | CommentSection, NotificationBell, socket.ts |
| 12 | `12-feat-dashboard-be` | feat | Stats API, Activity feed |
| 13 | `13-feat-dashboard-fe` | feat | 5 Widgets, Recharts |
| 14 | `14-feat-polish` | feat | Error handling, Loading, Responsive |
| 15 | `15-chore-deploy` | chore | Docker, Nginx, PM2, CI/CD |

## Merge Flow

```
main <- 00-foundation <- 01-auth-be <- 02-auth-fe <- 03-workspace-be
     <- 04-workspace-fe <- 05-project-task-be <- 06-project-task-fe
     <- 07-ai-be <- 08-ai-fe <- 09-kanban-fe <- 10-realtime-be
     <- 11-realtime-fe <- 12-dashboard-be <- 13-dashboard-fe
     <- 14-polish <- 15-deploy
```

## Quy trinh lam viec tren moi nhanh

1. `git checkout main && git pull`
2. `git checkout -b XX-type-ten`
3. Mo Claude Code CLI session moi
4. Agent doc `.context/branches/XX-type-ten/CONTEXT.md` de hieu scope
5. Lam tung buoc theo TODO.md (Learning Mode)
6. Cap nhat PROGRESS.md sau moi buoc
7. Xong -> review -> merge ve main

---

## Commit Message Convention

Format: `type(scope): message`

### Types

| Type | Mo ta |
|------|-------|
| `feat` | Tinh nang moi |
| `fix` | Sua bug |
| `chore` | Config, setup, khong anh huong logic |
| `refactor` | Tai cau truc code, khong thay doi behavior |
| `docs` | Tai lieu |
| `style` | Format code, khong anh huong logic |

### Scopes

`auth`, `workspace`, `project`, `task`, `ai`, `kanban`, `realtime`, `dashboard`, `prisma`, `shared`, `deploy`

### Examples

```
feat(auth): add JWT refresh token rotation
fix(task): correct subtask position ordering
chore(prisma): add RefreshToken and Activity models
```

---

## Conventions

- **Learning Mode**: Tat ca nhanh deu giai thich tung buoc
- **Testing**: Manual only (Postman/browser), khong viet unit test
- **Code comments**: Tieng Anh (chuan industry)
- **Branch context**: `.context/branches/XX/CONTEXT.md` + lien ket den `.context/specs/`

---

*Last updated: 2026-02-27*
