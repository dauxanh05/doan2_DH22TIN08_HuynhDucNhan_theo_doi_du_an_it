# DevTeamOS - Project

> **Core Value:** UX/UI xuat sac + AI features tich hop, toi uu thi truong Viet Nam

---

## What This Is

DevTeamOS la webapp quan ly tien do du an, ho tro freelancers va startup teams (2-15 nguoi) theo doi cong viec va cong tac hieu qua. MVP su dung tieng Viet only.

## Project Info

| Thong tin | Chi tiet |
|-----------|----------|
| **Ten du an** | DevTeamOS |
| **Target users** | Freelancers, Solo developers, Startup teams (2-15 nguoi) |
| **Monetization** | Freemium + Team plans (free ca nhan, tra phi team features) |
| **Ngon ngu MVP** | Tieng Viet only (i18n English sau) |
| **Deployment** | VPS (Nginx + PM2 + Docker) |

## Team & Timeline

- **Developer:** Solo developer (dang hoc)
- **Thoi gian du kien:** 4-5 thang (half-time ~20-30h/tuan)
- **Deadline:** Khong co hard deadline

## Kinh nghiem

- **Strong:** React, TypeScript, TailwindCSS
- **Can hoc:** NestJS, Prisma, Database Design, Docker

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

## Constraints

- **Solo dev**: 1 nguoi lam, can giai thich tung buoc (Learning Mode)
- **MVP scope**: Tieng Viet only, fixed TaskStatus (TODO/IN_PROGRESS/DONE)
- **No Redis/BullMQ**: JWT stateless, email gui sync
- **No Turborepo**: pnpm workspaces du cho 2 apps
- **Local storage**: File uploads luu local, migrate S3 sau

## 6 Phan chinh

| # | Phan | Spec file | Mo ta |
|---|------|-----------|-------|
| 1 | Auth & User | `specs/01-auth-user.md` | Dang ky, dang nhap, Google OAuth, JWT, profile |
| 2 | Workspace & Team | `specs/02-workspace-team.md` | Workspace, invite members, phan quyen 4 roles |
| 3 | Project, Task & AI | `specs/03-project-task-ai.md` | CRUD project/task, subtasks, checklist, AI features |
| 4 | Kanban Board | `specs/04-kanban.md` | Bang keo tha 3 cot, drag-drop, filter |
| 5 | Comments & Real-time | `specs/05-comments-realtime.md` | Comment, @mention, WebSocket real-time |
| 6 | Dashboard & Reports | `specs/06-dashboard-reports.md` | Bieu do, thong ke, workload |

## Sinh vien

| Ho va ten | MSSV | Lop |
|-----------|------|-----|
| Huynh Duc Nhan | 226610 | DH22TIN08 |

---

*Last updated: 2026-02-27*
