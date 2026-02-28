# Architecture: DevTeamOS

---

## Monorepo Structure

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
│       │   │   └── ai/
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
├── .context/                   # Project context docs
└── docker-compose.yml
```

---

## Backend Patterns (NestJS)

### Module Pattern

Moi domain la 1 module: `*.module.ts`, `*.controller.ts`, `*.service.ts`

- **Controllers** handle HTTP requests, delegate to services
- **Services** chua business logic, inject PrismaService
- API prefix: `/api`
- Swagger docs: `/api/docs`

### PrismaService

- Global module tai `src/prisma/`
- Inject via constructor trong bat ky service nao
- 1 instance duy nhat cho toan app

### Guards & Decorators

- `src/common/guards/jwt-auth.guard.ts` — bao ve routes can auth
- `src/common/guards/workspace-role.guard.ts` — kiem tra quyen trong workspace
- `src/common/decorators/current-user.decorator.ts` — lay user tu request

### Authentication Flow

```
Client --- Access Token (header) ---> API
  |                                    |
  |--- Refresh Token (cookie) -------> /auth/refresh
  |                                    |
  |<-- New Access Token + New Cookie --|
```

- Access token: JWT, 15 phut, luu trong memory (JS variable)
- Refresh token: random string, hash luu DB, 7 ngay, HTTP-only cookie
- Rotation: moi lan refresh tao cap token moi

---

## Frontend Patterns (React)

### Feature-based Structure

Moi feature nằm trong `src/features/{name}/` chua pages + components riêng.

### State Management

- **Auth state**: Zustand with persist middleware (`auth.store.ts`)
- **Server data**: TanStack Query hooks (caching, refetching)
- **API client**: Axios instance with auth interceptor (`services/api.ts`)
- **Theme**: Zustand store (`theme.store.ts`)
- **Workspace**: Zustand store (`workspace.store.ts`)

### Layouts

- `AuthLayout` — public pages (login, register)
- `DashboardLayout` — protected pages (sidebar, header, workspace switcher)

### Path Alias

- `@/` maps to `src/` (configured in tsconfig + vite)

### Styling

- TailwindCSS with custom component classes in `index.css`
- Dark mode via `class` strategy, controlled by `theme.store.ts`
- Component utilities: `btn`, `btn-primary`, `input`, `card`

---

## Database Schema (Prisma)

### Key Relationships

```
User --> WorkspaceMember --> Workspace    (multi-tenant)
Workspace --> Project --> Task           (hierarchy)
Task --> Task                            (self-referential, 2 levels max)
Task --> TaskAssignee, Comment, ChecklistItem, Attachment
```

### Models

| Model | Mo ta |
|-------|-------|
| User | Nguoi dung (email, password, Google OAuth) |
| RefreshToken | Refresh tokens luu trong DB |
| Workspace | Khong gian lam viec (multi-tenant) |
| WorkspaceMember | Thanh vien workspace (role) |
| WorkspaceInvitation | Loi moi qua email |
| Project | Du an trong workspace |
| Task | Cong viec (2 levels: task -> subtask) |
| TaskAssignee | Gan nguoi vao task |
| ChecklistItem | Danh sach viec nho |
| Attachment | File dinh kem |
| Comment | Binh luan (@mention) |
| Notification | Thong bao in-app |

### Enums

| Enum | Values |
|------|--------|
| AuthProvider | LOCAL, GOOGLE |
| Theme | LIGHT, DARK, SYSTEM |
| Role | OWNER, ADMIN, MEMBER, VIEWER |
| TaskStatus | TODO, IN_PROGRESS, DONE |
| Priority | URGENT, HIGH, MEDIUM, LOW |
| ProjectStatus | ACTIVE, COMPLETED, ARCHIVED |
| Plan | FREE, STARTER, PROFESSIONAL |
| NotificationType | TASK_ASSIGNED, TASK_UPDATED, TASK_COMPLETED, COMMENT_ADDED, COMMENT_MENTION, DEADLINE_APPROACHING, INVITATION_RECEIVED |

---

*Last updated: 2026-02-27*
