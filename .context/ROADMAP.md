# Roadmap: DevTeamOS

> **Thoi gian uoc tinh:** ~16-20 tuan (4-5 thang)

---

## Tong quan tien do

| Phase | Mo ta | Spec file | Branches | Trang thai | % |
|-------|-------|-----------|----------|------------|---|
| Phase 0 | Chuan bi (hoc, setup, thao luan) | - | `00-chore-foundation` | **Xong** | 100% |
| Phase 1 | Auth & User | `specs/01-auth-user.md` | `01-auth-be`, `02-auth-fe` | **Dang lam** | 40% |
| Phase 2 | Workspace & Team | `specs/02-workspace-team.md` | `03-workspace-be`, `04-workspace-fe` | Chua bat dau | 0% |
| Phase 3 | Project, Task & AI | `specs/03-project-task-ai.md` | `05-project-task-be`, `06-project-task-fe`, `07-ai-be`, `08-ai-fe` | Chua bat dau | 0% |
| Phase 4 | Kanban Board | `specs/04-kanban.md` | `09-kanban-fe` | Chua bat dau | 0% |
| Phase 5 | Comments & Real-time | `specs/05-comments-realtime.md` | `10-realtime-be`, `11-realtime-fe` | Chua bat dau | 0% |
| Phase 6 | Dashboard & Reports | `specs/06-dashboard-reports.md` | `12-dashboard-be`, `13-dashboard-fe` | Chua bat dau | 0% |
| Phase 7 | Polish & Deploy | - | `14-polish`, `15-deploy` | Chua bat dau | 0% |

**Tien do tong the: 12%**

**Progress: [##__________________] 12%**

---

## Phase 0: Chuan bi — XONG

- [x] Tao PROJECT_CONTEXT.md
- [x] Tao LEARNSTART.md
- [x] Them Learning Mode vao CLAUDE.md
- [x] Tao PROGRESS.md de tracking
- [x] Claim GitHub Student Developer Pack
- [x] Setup monorepo structure (pnpm workspaces)
- [x] Setup NestJS backend voi cau truc modules
- [x] Setup Vite + React + TypeScript frontend
- [x] Setup Prisma + PostgreSQL (Docker Compose)
- [x] Thao luan va quyet dinh chi tiet 6 phan du an
- [x] To chuc lai context thanh folder `context/`
- [x] Cau truc lai context thanh `.context/` (GSD-inspired)

---

## Phase 1: Auth & User — DANG LAM

> Requirements: AUTH-01..AUTH-13
> Branches: `01-feat-auth-be`, `02-feat-auth-fe`

### Backend (01-feat-auth-be) — Dang lam

- [x] Auth module setup + DTOs (AUTH-01)
- [x] Register + Login voi JWT (AUTH-01, AUTH-02)
- [x] Refresh token rotation + Logout (AUTH-03, AUTH-04)
- [x] Email verification + Password reset (AUTH-06, AUTH-07, AUTH-08)
- [x] Google OAuth login voi account merging (AUTH-05)
- [ ] Users module: profile, change password, upload avatar (AUTH-09, AUTH-10, AUTH-11)
- [ ] Auth guards + CurrentUser decorator (AUTH-12, AUTH-13)

### Frontend (02-feat-auth-fe) — Chua bat dau

- [ ] LoginPage + RegisterPage
- [ ] ForgotPasswordPage + ResetPasswordPage
- [ ] auth.store.ts + api.ts (axios interceptor)
- [ ] ProtectedRoute component

---

## Phase 2: Workspace & Team

> Requirements: WS-01..WS-14
> Branches: `03-feat-workspace-be`, `04-feat-workspace-fe`

- [ ] Workspace CRUD API (WS-01..WS-04)
- [ ] Members management API (WS-05..WS-09)
- [ ] Invitation flow - email + join link (WS-06, WS-07)
- [ ] Workspace role guard (WS-10, WS-11)
- [ ] Frontend: WorkspaceListPage, SettingsPage (WS-12)
- [ ] Frontend: MembersPage, JoinInvitationPage (WS-13)
- [ ] Frontend: WorkspaceSwitcher (WS-14)

---

## Phase 3: Project, Task & AI

> Requirements: PROJ-01..PROJ-07, TASK-01..TASK-11, AI-01..AI-06
> Branches: `05-project-task-be`, `06-project-task-fe`, `07-ai-be`, `08-ai-fe`

- [ ] Project CRUD API + frontend (PROJ-01..PROJ-07)
- [ ] Task CRUD API (TASK-01..TASK-05)
- [ ] Subtasks, Assignees, Checklist, Attachments (TASK-06..TASK-09)
- [ ] Task reorder API (TASK-10)
- [ ] Task Detail Modal frontend (TASK-11)
- [ ] File upload local storage (TASK-09)
- [ ] AI module backend (AI-05)
- [ ] AI: Goi y chia task (AI-01)
- [ ] AI: Phan tich tien do (AI-02)
- [ ] AI: Auto-assign (AI-03)
- [ ] AI: Code assistant (AI-04)
- [ ] AI frontend components (AI-06)

---

## Phase 4: Kanban Board

> Requirements: KAN-01..KAN-07
> Branch: `09-feat-kanban-fe`

- [ ] KanbanBoard + KanbanColumn + TaskCard (KAN-01, KAN-02)
- [ ] Drag-drop voi @dnd-kit (KAN-03, KAN-04)
- [ ] KanbanFilterBar (KAN-05)
- [ ] QuickAddTask inline (KAN-06)
- [ ] Overdue styling (KAN-07)

---

## Phase 5: Comments & Real-time

> Requirements: RT-01..RT-10
> Branches: `10-feat-realtime-be`, `11-feat-realtime-fe`

- [ ] Comments CRUD API (RT-01)
- [ ] @mention parsing + notification (RT-02, RT-03)
- [ ] Notifications API (RT-04, RT-05, RT-06)
- [ ] WebSocket Gateway (RT-07, RT-08)
- [ ] Real-time Kanban updates (RT-09)
- [ ] Notification types (RT-10)
- [ ] Frontend: CommentSection + MentionInput
- [ ] Frontend: NotificationBell + dropdown
- [ ] Frontend: socket.ts client setup

---

## Phase 6: Dashboard & Reports

> Requirements: DASH-01..DASH-07
> Branches: `12-feat-dashboard-be`, `13-feat-dashboard-fe`

- [ ] Dashboard stats API (DASH-01)
- [ ] Activity feed API (DASH-02)
- [ ] ProjectProgressWidget (DASH-03)
- [ ] TasksStatusChart - Recharts pie chart (DASH-04)
- [ ] OverdueTasksWidget (DASH-05)
- [ ] RecentActivityWidget (DASH-06)
- [ ] MemberWorkloadChart - Recharts bar chart (DASH-07)

---

## Phase 7: Polish & Deploy

> Requirements: DEPLOY-01..DEPLOY-10
> Branches: `14-feat-polish`, `15-chore-deploy`

- [ ] Error handling - global error boundary, toast (DEPLOY-01)
- [ ] Loading states - skeletons (DEPLOY-02)
- [ ] Empty states (DEPLOY-03)
- [ ] Responsive design (DEPLOY-04)
- [ ] Docker setup production (DEPLOY-05)
- [ ] Nginx configuration (DEPLOY-06)
- [ ] PM2 setup (DEPLOY-07)
- [ ] CI/CD GitHub Actions (DEPLOY-08)
- [ ] SSL certificate (DEPLOY-09)
- [ ] Domain setup (DEPLOY-10)

---

*Last updated: 2026-02-27*
