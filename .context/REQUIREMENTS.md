# Requirements: DevTeamOS

> **Format:** `[CATEGORY]-[NUMBER]` — Moi requirement co ID duy nhat de tracking
> **Status:** `[ ]` = Chua lam, `[~]` = Dang lam, `[x]` = Xong

---

## v1 Requirements (MVP)

### Authentication & User (AUTH)

- [x] **AUTH-01**: User dang ky bang email va password
- [x] **AUTH-02**: User dang nhap bang email/password, nhan access token + refresh token cookie
- [x] **AUTH-03**: Refresh token rotation (DB + HTTP-only cookie, 7 ngay)
- [x] **AUTH-04**: Logout xoa refresh token trong DB + clear cookie
- [x] **AUTH-05**: Dang nhap bang Google OAuth (tao tai khoan tu dong neu chua co)
- [x] **AUTH-06**: Email verification sau khi dang ky
- [x] **AUTH-07**: Forgot password gui email reset link
- [x] **AUTH-08**: Reset password bang token
- [x] **AUTH-09**: Xem va cap nhat profile (name, avatar, theme)
- [x] **AUTH-10**: Doi mat khau
- [x] **AUTH-11**: Upload avatar
- [x] **AUTH-12**: JWT auth guard bao ve tat ca protected routes
- [x] **AUTH-13**: @CurrentUser decorator lay thong tin user hien tai

### Workspace & Team (WS)

- [x] **WS-01**: Tao workspace (user tro thanh OWNER)
- [x] **WS-02**: Xem danh sach workspaces cua user
- [x] **WS-03**: Cap nhat workspace settings (OWNER, ADMIN)
- [x] **WS-04**: Xoa workspace (OWNER only)
- [x] **WS-05**: Xem danh sach members
- [x] **WS-06**: Moi member qua email (gui invitation link, het han 7 ngay)
- [x] **WS-07**: Join workspace tu invitation link
- [x] **WS-08**: Xoa member khoi workspace (OWNER, ADMIN)
- [x] **WS-09**: Doi role member (OWNER, ADMIN)
- [x] **WS-10**: Phan quyen 4 roles: OWNER, ADMIN, MEMBER, VIEWER
- [x] **WS-11**: Workspace role guard kiem tra quyen truoc moi action
- [x] **WS-12**: Frontend WorkspaceListPage + WorkspaceSettingsPage
- [x] **WS-13**: Frontend MembersPage + JoinInvitationPage
- [x] **WS-14**: Frontend WorkspaceSwitcher dropdown o header

### Project (PROJ)

- [x] **PROJ-01**: Tao project trong workspace
- [x] **PROJ-02**: Xem danh sach projects trong workspace
- [x] **PROJ-03**: Xem chi tiet project
- [x] **PROJ-04**: Cap nhat project (name, description, color, icon, status)
- [x] **PROJ-05**: Xoa project
- [x] **PROJ-06**: Xem thong ke project (tong tasks, % hoan thanh)
- [x] **PROJ-07**: Frontend ProjectListPage + ProjectDetailPage

### Task (TASK)

- [x] **TASK-01**: Tao task trong project
- [x] **TASK-02**: Xem danh sach tasks (filter, sort)
- [x] **TASK-03**: Xem chi tiet task
- [x] **TASK-04**: Cap nhat task (title, description, status, priority, dueDate)
- [x] **TASK-05**: Xoa task
- [x] **TASK-06**: Tao subtask (2 levels max: task -> subtask)
- [x] **TASK-07**: Assign/unassign user vao task (nhieu nguoi 1 task)
- [x] **TASK-08**: Them/sua/xoa/toggle checklist items
- [x] **TASK-09**: Upload/xoa file attachments (local storage)
- [x] **TASK-10**: Reorder tasks (cap nhat position khi drag-drop)
- [x] **TASK-11**: Frontend TaskDetailModal (modal overlay)

### Kanban Board (KAN)

- [ ] **KAN-01**: Hien thi Kanban board 3 cot co dinh: TODO, IN_PROGRESS, DONE
- [ ] **KAN-02**: Task card hien thi: title, priority badge, assignee avatars, due date
- [ ] **KAN-03**: Drag-drop cross-column (doi status) bang @dnd-kit
- [ ] **KAN-04**: Drag-drop same-column reorder (doi position)
- [ ] **KAN-05**: Filter: assignee + priority + search (client-side, AND logic)
- [ ] **KAN-06**: Quick add task inline moi cot
- [ ] **KAN-07**: Overdue styling (do neu qua han, vang neu hom nay)

### AI Features (AI)

- [x] **AI-01**: AI goi y chia task — input mo ta task, output danh sach subtasks goi y
- [x] **AI-02**: AI phan tich tien do — input project data, output bao cao + risks + goi y
- [x] **AI-03**: AI auto-assign — input task + members + workload, output goi y nguoi phu hop
- [x] **AI-04**: AI code assistant — input mo ta ky thuat, output huong dan + code mau
- [x] **AI-05**: AI module backend (ai.module, ai.controller, ai.service)
- [x] **AI-06**: 4 AI frontend components (AiTaskSplitter, AiProgressAnalyzer, AiAutoAssign, AiCodeAssistant)

### Comments & Real-time (RT)

- [ ] **RT-01**: Them/sua/xoa comment trong task (chi nguoi viet duoc sua/xoa)
- [ ] **RT-02**: @mention voi autocomplete dropdown (highlight xanh, click xem profile)
- [ ] **RT-03**: Tao notification khi @mention
- [ ] **RT-04**: Xem danh sach notifications (paginated)
- [ ] **RT-05**: Danh dau da doc / doc tat ca notifications
- [ ] **RT-06**: Unread count badge tren notification bell
- [ ] **RT-07**: WebSocket Gateway (Socket.io) voi JWT authentication
- [ ] **RT-08**: Real-time events: task_created, task_updated, task_deleted, comment_added
- [ ] **RT-09**: Real-time Kanban updates (thay card di chuyen khi nguoi khac keo)
- [ ] **RT-10**: 7 loai notification: TASK_ASSIGNED, TASK_UPDATED, TASK_COMPLETED, COMMENT_ADDED, COMMENT_MENTION, DEADLINE_APPROACHING, INVITATION_RECEIVED

### Dashboard & Reports (DASH)

- [ ] **DASH-01**: Dashboard stats API (project progress, tasks by status, overdue, workload)
- [ ] **DASH-02**: Activity feed API (paginated, 20 items/page)
- [ ] **DASH-03**: ProjectProgressWidget — progress bar moi project
- [ ] **DASH-04**: TasksStatusChart — Recharts pie chart (TODO/IN_PROGRESS/DONE)
- [ ] **DASH-05**: OverdueTasksWidget — danh sach task qua han
- [ ] **DASH-06**: RecentActivityWidget — feed hoat dong gan day
- [ ] **DASH-07**: MemberWorkloadChart — Recharts bar chart so task/member

### Polish & Deploy (DEPLOY)

- [ ] **DEPLOY-01**: Global error boundary + toast notifications
- [ ] **DEPLOY-02**: Loading states (skeleton screens)
- [ ] **DEPLOY-03**: Empty states cho danh sach trong
- [ ] **DEPLOY-04**: Responsive design (mobile-friendly)
- [ ] **DEPLOY-05**: Docker setup production
- [ ] **DEPLOY-06**: Nginx reverse proxy configuration
- [ ] **DEPLOY-07**: PM2 process manager
- [ ] **DEPLOY-08**: CI/CD voi GitHub Actions
- [ ] **DEPLOY-09**: SSL certificate (Let's Encrypt)
- [ ] **DEPLOY-10**: Domain setup

---

## v2 Requirements (Post-MVP)

- [ ] **V2-01**: i18n English support
- [ ] **V2-02**: GitHub OAuth
- [ ] **V2-03**: Rich text editor cho task description
- [ ] **V2-04**: S3 file storage thay local
- [ ] **V2-05**: Custom task status workflows
- [ ] **V2-06**: Redis caching
- [ ] **V2-07**: BullMQ email queue
- [ ] **V2-08**: Time tracking per task
- [ ] **V2-09**: Gantt chart view
- [ ] **V2-10**: Mobile app (React Native)

---

## Out of Scope (MVP)

| Feature | Ly do |
|---------|-------|
| Redis / BullMQ | JWT stateless, email gui sync du cho MVP |
| Turborepo | pnpm workspaces du cho 2 apps |
| react-i18next | Tieng Viet only |
| GitHub OAuth | Chi Google + Email |
| Custom task status | 3 cot co dinh (TODO/IN_PROGRESS/DONE) |
| Rich text editor | Plain text don gian hon |
| S3 storage | Local storage truoc, migrate sau |
| Unit tests | Manual testing only (Postman/browser) |

---

## Traceability

| Requirement | Phase | Branch | Status |
|-------------|-------|--------|--------|
| AUTH-01..13 | Phase 1 | `01-feat-auth-be` | Hoan thanh |
| AUTH (FE) | Phase 1 | `02-feat-auth-fe` | Dang lam |
| WS-01..11 | Phase 2 | `03-feat-workspace-be` | Hoan thanh |
| WS-12..14 | Phase 2 | `04-feat-workspace-fe` | Chua lam |
| PROJ-01..07 | Phase 3 | `05-feat-project-task-be`, `06-feat-project-task-fe` | Hoan thanh |
| TASK-01..11 | Phase 3 | `05-feat-project-task-be`, `06-feat-project-task-fe` | Hoan thanh |
| AI-01..06 | Phase 3 | `07-feat-ai-be`, `08-feat-ai-fe` | Hoan thanh |
| KAN-01..07 | Phase 4 | `09-feat-kanban-fe` | Chua lam |
| RT-01..10 | Phase 5 | `10-feat-realtime-be`, `11-feat-realtime-fe` | Chua lam |
| DASH-01..07 | Phase 6 | `12-feat-dashboard-be`, `13-feat-dashboard-fe` | Chua lam |
| DEPLOY-01..10 | Phase 7 | `14-feat-polish`, `15-chore-deploy` | Chua lam |

**Coverage:** 78 v1 requirements, 10 v2 requirements
**Mapped:** 78/78 (100%)

---

*Last updated: 2026-03-14*
