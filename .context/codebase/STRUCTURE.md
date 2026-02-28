# Codebase Structure

> Scan tu code that. Cap nhat khi them files/folders moi.
> Last scan: 2026-02-27 (branch: 01-feat-auth-be)

---

## Root

```
devteamos/
├── apps/
│   ├── api/                         # NestJS backend
│   └── web/                         # React frontend
├── packages/
│   └── shared/                      # Shared types, constants
├── .context/                        # Project context (hidden)
├── docker-compose.yml               # PostgreSQL (port 5433)
├── pnpm-workspace.yaml              # Monorepo config
├── package.json                     # Root scripts (dev, build)
├── CLAUDE.md                        # Agent instructions (~58 dong)
└── README.md                        # Public readme
```

## Backend — apps/api/src/

```
src/
├── main.ts                          # App bootstrap, CORS, ValidationPipe, Swagger
├── app.module.ts                    # Root module, imports all modules
│
├── prisma/                          # Database
│   ├── prisma.module.ts             # Global module
│   └── prisma.service.ts            # PrismaClient wrapper, onModuleInit
│
├── common/                          # Shared utilities
│   ├── decorators/
│   │   └── current-user.decorator.ts  # @CurrentUser() param decorator
│   └── guards/
│       └── jwt-auth.guard.ts        # JWT authentication guard
│
└── modules/
    ├── auth/                        # ✅ ACTIVE — dang code
    │   ├── auth.module.ts
    │   ├── auth.controller.ts       # /auth/* endpoints
    │   ├── auth.service.ts          # Register, login, refresh, OAuth, email verify
    │   ├── dto/
    │   │   ├── register.dto.ts
    │   │   ├── login.dto.ts
    │   │   ├── forgot-password.dto.ts
    │   │   └── reset-password.dto.ts
    │   ├── guards/
    │   │   └── google-auth.guard.ts
    │   ├── strategies/
    │   │   ├── jwt.strategy.ts      # JWT validation
    │   │   └── google.strategy.ts   # Google OAuth
    │   └── interfaces/
    │       └── jwt-payload.interface.ts
    │
    ├── users/                       # ⏳ SKELETON — chua co logic
    │   ├── users.module.ts
    │   ├── users.controller.ts
    │   └── users.service.ts
    │
    ├── email/                       # ✅ ACTIVE — dang dung
    │   ├── email.module.ts
    │   └── email.service.ts         # Nodemailer: verify email, reset password
    │
    ├── workspaces/                  # ⏳ SKELETON
    │   ├── workspaces.module.ts
    │   ├── workspaces.controller.ts
    │   └── workspaces.service.ts
    │
    ├── projects/                    # ⏳ SKELETON
    │   ├── projects.module.ts
    │   ├── projects.controller.ts
    │   └── projects.service.ts
    │
    ├── tasks/                       # ⏳ SKELETON
    │   ├── tasks.module.ts
    │   ├── tasks.controller.ts
    │   └── tasks.service.ts
    │
    ├── comments/                    # ⏳ SKELETON
    │   ├── comments.module.ts
    │   ├── comments.controller.ts
    │   └── comments.service.ts
    │
    ├── notifications/               # ⏳ SKELETON
    │   ├── notifications.module.ts
    │   ├── notifications.controller.ts
    │   └── notifications.service.ts
    │
    └── files/                       # ⏳ SKELETON
        ├── files.module.ts
        ├── files.controller.ts
        └── files.service.ts
```

## Frontend — apps/web/src/

```
src/
├── main.tsx                         # App entry point
├── App.tsx                          # Router setup
├── index.css                        # Tailwind + custom utilities
├── vite-env.d.ts                    # Vite type declarations
│
├── components/                      # Shared UI
│   ├── Header.tsx                   # ⏳ SKELETON
│   └── Sidebar.tsx                  # ⏳ SKELETON
│
├── features/                        # Feature modules
│   ├── auth/
│   │   ├── LoginPage.tsx            # ⏳ SKELETON
│   │   └── RegisterPage.tsx         # ⏳ SKELETON
│   ├── dashboard/
│   │   └── DashboardPage.tsx        # ⏳ SKELETON
│   ├── kanban/
│   │   └── KanbanPage.tsx           # ⏳ SKELETON
│   └── projects/
│       └── ProjectsPage.tsx         # ⏳ SKELETON
│
├── layouts/
│   ├── AuthLayout.tsx               # Public pages layout
│   └── DashboardLayout.tsx          # Protected pages layout
│
├── services/
│   └── api.ts                       # Axios instance + interceptor
│
└── stores/
    ├── auth.store.ts                # Zustand: user, isAuthenticated
    ├── theme.store.ts               # Zustand: dark/light mode
    └── workspace.store.ts           # Zustand: current workspace
```

## Packages — packages/shared/

```
shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                     # Re-exports
    └── types.ts                     # Shared TypeScript types
```

---

## Status Legend

- ✅ **ACTIVE** — Co logic, dang duoc code
- ⏳ **SKELETON** — File co san nhung chua co logic (empty/placeholder)

---

*Last updated: 2026-02-27*
