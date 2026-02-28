# DevTeamOS - Overview

> **File tong quat du an. Chi tiet tung phan xem cac file 01-06.**

---

## Tong quan

| Thong tin | Chi tiet |
|-----------|----------|
| **Ten du an** | DevTeamOS |
| **Mo ta** | Webapp quan ly tien do du an cho freelancers va startup teams |
| **Target users** | Freelancers, Solo developers, Startup teams (2-15 nguoi) |
| **Differentiator** | UX/UI xuat sac + AI features tich hop, toi uu thi truong Viet Nam |
| **Monetization** | Freemium + Team plans (free cho ca nhan, tra phi cho team features) |
| **Ngon ngu MVP** | Tieng Viet only (i18n English o Phase 2) |
| **Deployment** | VPS co san (Nginx + PM2 + Docker) |

### Team & Timeline
- **Developer:** Solo developer
- **Thoi gian du kien:** 4-5 thang (half-time ~20-30h/tuan)
- **Deadline:** Khong co hard deadline

### Kinh nghiem hien tai
- **Strong:** React, TypeScript, TailwindCSS
- **Can hoc:** NestJS, Prisma, Database Design, Docker

---

## Tech Stack

### Frontend
| Cong nghe | Muc dich |
|-----------|----------|
| React 18 + TypeScript | Framework chinh |
| Vite | Build tool |
| TailwindCSS + Headless UI | Styling |
| Zustand | State management |
| TanStack Query | Server state + caching |
| React Hook Form + Zod | Forms + validation |
| React Router v6 | Routing |
| @dnd-kit | Drag-drop cho Kanban |
| Recharts | Dashboard charts |
| date-fns | Date utilities |
| Lucide React | Icons |
| Socket.io-client | WebSocket client |

### Backend
| Cong nghe | Muc dich |
|-----------|----------|
| NestJS | Framework chinh |
| Prisma | ORM |
| PostgreSQL | Database |
| Passport.js | Authentication |
| @nestjs/jwt | JWT tokens |
| passport-google-oauth20 | Google OAuth |
| Socket.io | WebSocket server |
| class-validator | Request validation |
| @nestjs/swagger | API documentation |
| Nodemailer | Email notifications |

### DevOps
| Cong nghe | Muc dich |
|-----------|----------|
| pnpm workspaces | Monorepo (khong dung Turborepo) |
| Docker Compose | Local development (PostgreSQL) |
| Nginx | Reverse proxy |
| PM2 | Process manager |
| GitHub Actions | CI/CD |

### Da loai bo khoi MVP
- ~~Redis~~ -> Dung JWT stateless, khong can session store
- ~~BullMQ~~ -> Email gui sync hoac simple in-memory queue
- ~~Turborepo~~ -> pnpm workspaces du cho 2 apps
- ~~react-i18next~~ -> Tieng Viet only cho MVP
- ~~GitHub OAuth~~ -> Chi Google + Email

---

## Cau truc Monorepo

```
devteamos/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── features/       # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── workspaces/
│   │   │   │   ├── projects/
│   │   │   │   ├── tasks/
│   │   │   │   ├── kanban/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── settings/
│   │   │   │   └── notifications/
│   │   │   ├── hooks/
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── services/       # API calls
│   │   │   ├── layouts/
│   │   │   └── utils/
│   │   └── ...
│   │
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── workspaces/
│       │   │   ├── projects/
│       │   │   ├── tasks/
│       │   │   ├── comments/
│       │   │   ├── notifications/
│       │   │   ├── files/
│       │   │   └── ai/         # AI Features module
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   ├── guards/
│       │   │   ├── interceptors/
│       │   │   └── filters/
│       │   ├── config/
│       │   └── prisma/
│       ├── prisma/
│       │   └── schema.prisma
│       └── ...
│
├── packages/
│   └── shared/                 # Shared types, constants
│
├── context/                    # Project context docs
│   ├── overview.md             # <- Ban dang doc file nay
│   ├── 01-auth-user.md
│   ├── 02-workspace-team.md
│   ├── 03-project-task-ai.md
│   ├── 04-kanban.md
│   ├── 05-comments-realtime.md
│   └── 06-dashboard-reports.md
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── PROGRESS.md
└── package.json
```

---

## 6 Phan chinh cua du an

| # | Phan | File chi tiet | Mo ta |
|---|------|---------------|-------|
| 1 | Auth & User | `01-auth-user.md` | Dang ky, dang nhap, Google OAuth, JWT, profile |
| 2 | Workspace & Team | `02-workspace-team.md` | Workspace, invite members, phan quyen 4 roles |
| 3 | Project, Task & AI | `03-project-task-ai.md` | CRUD project/task, subtasks, checklist, AI features |
| 4 | Kanban Board | `04-kanban.md` | Bang keo tha 3 cot, drag-drop, filter |
| 5 | Comments & Real-time | `05-comments-realtime.md` | Comment, @mention, WebSocket real-time |
| 6 | Dashboard & Reports | `06-dashboard-reports.md` | Bieu do, thong ke, workload |

---

## Database Schema (Prisma)

> Chi tiet schema xem trong `apps/api/prisma/schema.prisma`

### Models chinh:
- **User** - Nguoi dung (email, password, Google OAuth)
- **Workspace** - Khong gian lam viec (multi-tenant)
- **WorkspaceMember** - Thanh vien workspace (role: OWNER/ADMIN/MEMBER/VIEWER)
- **WorkspaceInvitation** - Loi moi qua email
- **Project** - Du an trong workspace
- **Task** - Cong viec (2 levels: task -> subtask)
- **TaskAssignee** - Gan nguoi vao task
- **ChecklistItem** - Danh sach viec nho trong task
- **Attachment** - File dinh kem
- **Comment** - Binh luan (@mention)
- **Notification** - Thong bao

### Enums:
- `AuthProvider`: LOCAL, GOOGLE
- `Role`: OWNER, ADMIN, MEMBER, VIEWER
- `TaskStatus`: TODO, IN_PROGRESS, DONE (co dinh)
- `Priority`: URGENT, HIGH, MEDIUM, LOW
- `ProjectStatus`: ACTIVE, COMPLETED, ARCHIVED
- `Plan`: FREE, STARTER, PROFESSIONAL

---

## Environment Variables

### Backend (.env in apps/api)
```env
DATABASE_URL="postgresql://user:password@localhost:5433/devteamos"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

GOOGLE_CLIENT_ID="xxx"
GOOGLE_CLIENT_SECRET="xxx"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"
EMAIL_FROM="DevTeamOS <noreply@devteamos.com>"

AI_API_URL="https://manager.devteamos.me/v1/messages"

FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="./uploads"
```

### Frontend (.env in apps/web)
```env
VITE_API_URL="http://localhost:3000/api"
VITE_WS_URL="ws://localhost:3000"
```

---

## Key Decisions Log

| Quyet dinh | Ly do |
|------------|-------|
| pnpm workspaces thay Turborepo | Du dung cho 2 apps, giam complexity |
| Fixed TaskStatus thay Custom Workflow | Don gian cho MVP, users khong can customize |
| 2 levels subtasks | Du cho use cases pho bien, de implement |
| Tieng Viet only | Target thi truong VN, them EN sau |
| Google OAuth only | Pho bien nhat, GitHub them sau |
| Local file storage | Don gian, migrate S3 sau khi can |
| Nodemailer thay BullMQ | It emails, khong can queue phuc tap |
| Socket.io | De dung hon raw WebSocket |
| Refresh token: DB + Cookie | An toan nhat, co the revoke token |
| Task detail: Modal | Nhanh, khong roi trang (giong Trello) |
| Description: Plain text | Don gian, rich text editor them sau |
| AI tich hop vao MVP | Nang cap gia tri san pham, dung API manager.devteamos.me |

---

*Last updated: 2026-02-15*
*Version: 2.0 (MVP + AI Features)*
