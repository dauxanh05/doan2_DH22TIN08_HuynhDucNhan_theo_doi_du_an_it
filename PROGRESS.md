# PROGRESS.md - Tien do du an DevTeamOS

> **Cap nhat lan cuoi:** 2026-02-15
> **Phase hien tai:** Phase 0 - Chuan bi
> **Context chi tiet:** Xem folder `context/`

---

## Tong quan tien do

| Phase | Mo ta | Context file | Trang thai | % |
|-------|-------|--------------|------------|---|
| Phase 0 | Chuan bi (hoc, setup, thao luan) | - | **Dang lam** | 30% |
| Phase 1 | Auth & User | `context/01-auth-user.md` | Chua bat dau | 0% |
| Phase 2 | Workspace & Team | `context/02-workspace-team.md` | Chua bat dau | 0% |
| Phase 3 | Project, Task & AI | `context/03-project-task-ai.md` | Chua bat dau | 0% |
| Phase 4 | Kanban Board | `context/04-kanban.md` | Chua bat dau | 0% |
| Phase 5 | Comments & Real-time | `context/05-comments-realtime.md` | Chua bat dau | 0% |
| Phase 6 | Dashboard & Reports | `context/06-dashboard-reports.md` | Chua bat dau | 0% |
| Phase 7 | Polish & Deploy | - | Chua bat dau | 0% |

**Tien do tong the: 4%**

**Thoi gian uoc tinh: ~16-20 tuan (4-5 thang)**

---

## Phase 0: Chuan bi

### Hoan thanh
- [x] Tao PROJECT_CONTEXT.md - Dinh nghia du an chi tiet
- [x] Tao LEARNSTART.md - Lo trinh hoc tap
- [x] Them Learning Mode vao CLAUDE.md - Rules cho Claude ho tro hoc
- [x] Tao PROGRESS.md - File tracking tien do
- [x] Claim GitHub Student Developer Pack + resources (~$10,000+ value)
- [x] Setup monorepo structure (pnpm workspaces) - skeleton co san
- [x] Setup NestJS backend voi cau truc modules - skeleton co san
- [x] Setup Vite + React + TypeScript frontend - skeleton co san
- [x] Setup Prisma + PostgreSQL (Docker Compose) - migration da co
- [x] Thao luan va quyet dinh chi tiet 6 phan du an (Session 3)
- [x] To chuc lai context thanh folder `context/` voi 7 files

### Dang lam
- [ ] Hoc Node.js fundamentals
- [ ] Hoc NestJS basics
- [ ] Hoc Prisma ORM

### Sap lam
- [ ] Review va cap nhat Prisma schema (them refresh token, AI-related fields)
- [ ] Bat dau Phase 1: Auth & User

---

## Phase 1: Auth & User
> Chua bat dau | Chi tiet: `context/01-auth-user.md`

### Quyet dinh
- Email/Password + Google OAuth (lam luon)
- Email Verification + Forgot Password (lam luon, can SMTP)
- Refresh Token: Database + Cookie

### Tasks
- [ ] Cap nhat Prisma schema (them refresh token table)
- [ ] Auth module: register, login, logout
- [ ] JWT strategy + refresh token rotation
- [ ] Google OAuth strategy
- [ ] Email verification flow
- [ ] Forgot/Reset password flow
- [ ] Users module: profile, change password, upload avatar
- [ ] Auth guards + CurrentUser decorator
- [ ] Frontend: LoginPage, RegisterPage
- [ ] Frontend: ForgotPasswordPage, ResetPasswordPage
- [ ] Frontend: auth.store.ts + api.ts (axios interceptor)
- [ ] Frontend: ProtectedRoute component

---

## Phase 2: Workspace & Team
> Chua bat dau | Chi tiet: `context/02-workspace-team.md`

### Quyet dinh
- Multi-workspace (1 user nhieu workspace)
- Email invitation
- 4 roles: OWNER, ADMIN, MEMBER, VIEWER

### Tasks
- [ ] Workspace CRUD API
- [ ] Members management API (list, invite, remove, change role)
- [ ] Invitation flow (email + join link)
- [ ] Workspace role guard
- [ ] Frontend: WorkspaceListPage, WorkspaceSettingsPage
- [ ] Frontend: MembersPage, JoinInvitationPage
- [ ] Frontend: WorkspaceSwitcher component

---

## Phase 3: Project, Task & AI
> Chua bat dau | Chi tiet: `context/03-project-task-ai.md`

### Quyet dinh
- Task detail: Modal
- Description: Plain text
- Attachments: Local storage
- AI Features: 4 cai trong MVP (goi y chia task, phan tich tien do, auto-assign, code assistant)
- AI Backend: API manager.devteamos.me

### Tasks
- [ ] Project CRUD API + frontend pages
- [ ] Task CRUD API
- [ ] Subtasks, Assignees, Checklist, Attachments API
- [ ] Task Detail Modal (frontend)
- [ ] File upload (local storage)
- [ ] AI module: ai.module.ts, ai.controller.ts, ai.service.ts
- [ ] AI: Goi y chia task (POST /ai/split-task)
- [ ] AI: Phan tich tien do (POST /ai/analyze-progress)
- [ ] AI: Auto-assign (POST /ai/suggest-assignee)
- [ ] AI: Code assistant (POST /ai/code-assist)
- [ ] Frontend AI components (4 cai)

---

## Phase 4: Kanban Board
> Chua bat dau | Chi tiet: `context/04-kanban.md`

### Quyet dinh
- 3 cot co dinh: TODO, IN_PROGRESS, DONE
- Card: Title + Priority badge + Assignee avatars + Due date
- Filter: assignee + priority + search (co ban)

### Tasks
- [ ] KanbanBoard + KanbanColumn + TaskCard components
- [ ] Drag-drop voi @dnd-kit (cross-column + reorder)
- [ ] Reorder API (PATCH /tasks/reorder)
- [ ] KanbanFilterBar (assignee, priority, search)
- [ ] QuickAddTask (inline input moi cot)

---

## Phase 5: Comments & Real-time
> Chua bat dau | Chi tiet: `context/05-comments-realtime.md`

### Quyet dinh
- Comments voi @mention + autocomplete
- WebSocket (Socket.io) cho real-time
- In-app notifications

### Tasks
- [ ] Comments CRUD API
- [ ] @mention parsing + notification creation
- [ ] Notifications API (list, read, read-all, unread-count)
- [ ] WebSocket Gateway (NestJS)
- [ ] Socket.io client setup (frontend)
- [ ] Real-time task updates on Kanban
- [ ] NotificationBell + dropdown (frontend)
- [ ] CommentSection + MentionInput (frontend)

---

## Phase 6: Dashboard & Reports
> Chua bat dau | Chi tiet: `context/06-dashboard-reports.md`

### Quyet dinh
- 4 widgets: Project progress, Tasks by status, Overdue tasks, Recent activity
- Recharts cho bieu do
- Member workload chart

### Tasks
- [ ] Dashboard stats API (GET /workspaces/:id/dashboard/stats)
- [ ] Activity feed API (GET /workspaces/:id/dashboard/activity)
- [ ] DashboardPage layout
- [ ] ProjectProgressWidget
- [ ] TasksStatusChart (Recharts pie chart)
- [ ] OverdueTasksWidget
- [ ] RecentActivityWidget
- [ ] MemberWorkloadChart (Recharts bar chart)

---

## Phase 7: Polish & Deploy
> Chua bat dau

### Tasks
- [ ] Error handling (global error boundary, toast)
- [ ] Loading states (skeletons)
- [ ] Empty states
- [ ] Responsive design (mobile-friendly)
- [ ] Docker setup cho production
- [ ] Nginx configuration
- [ ] PM2 setup
- [ ] CI/CD voi GitHub Actions
- [ ] SSL certificate (Let's Encrypt)
- [ ] Domain setup

---

## Session Log

### Session 1 - 2026-01-21
**Thoi gian:** ~2h
**Da lam:**
- Tao PROJECT_CONTEXT.md voi day du specs du an
- Tao LEARNSTART.md voi lo trinh hoc chi tiet
- Them Learning Mode rules vao CLAUDE.md
- Tao PROGRESS.md de tracking

**Hoc duoc:**
- Hieu cau truc du an DevTeamOS
- Biet nhung gi can hoc (Node.js, NestJS, Prisma, Docker...)
- Co lo trinh hoc ro rang

---

### Session 2 - 2026-01-26
**Thoi gian:** 2 ngay (25-26/01/2026)
**Da lam:**
- Claim GitHub Student Developer Pack

**Resources nhan duoc:**
| Resource | Gia tri | Het han |
|----------|---------|---------|
| GitHub Student Developer Pack | Gateway to all | Khi het sinh vien |
| DigitalOcean Credits | $200 | Jan 2027 |
| Microsoft Azure Credits | $100 | Apr 2026 |
| Datadog Pro | ~$9,600 (2 nam) | Jan 2028 |
| Domain devteamos.me | ~$15 | Jan 2027 |
| Domain devpathos.tech | ~$50 | Jan 2027 |
| SSL Certificate PositiveSSL | ~$10 | Jan 2027 |

---

### Session 3 - 2026-02-15
**Thoi gian:** ~1h
**Da lam:**
- Thao luan chi tiet 6 phan du an
- Quyet dinh features cho tung phan
- Them 4 AI Features vao MVP scope
- To chuc lai context: tao folder `context/` voi 7 files
- Cap nhat PROGRESS.md voi quyet dinh moi
- Xoa PROJECT_CONTEXT.md (noi dung chuyen vao context/)

**Quyet dinh quan trong:**
- Google OAuth + Email features: lam luon trong MVP
- Refresh token: Database + Cookie
- 4 AI Features tich hop vao MVP (tang thoi gian len ~16-20 tuan)
- AI Backend: API manager.devteamos.me
- Task detail: Modal, Description: Plain text
- Kanban: 3 cot co dinh, filter co ban
- WebSocket cho real-time
- Recharts cho dashboard charts

**Tiep theo:**
- Review Prisma schema (them refresh token, AI fields)
- Bat dau Phase 1: Auth & User

---

## Notes
- Moi session lam viec, them entry vao Session Log
- Cap nhat checkbox khi hoan thanh task
- Cap nhat % tien do o bang tong quan
- Context chi tiet: xem folder `context/`
