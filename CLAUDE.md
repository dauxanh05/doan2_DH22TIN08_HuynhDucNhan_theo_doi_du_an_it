# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTeamOS là webapp quản lý tiến độ dự án, target freelancers và startup teams (2-15 người). MVP sử dụng tiếng Việt only.

## Commands

### Development
```bash
# Start all services (requires Docker for PostgreSQL)
docker compose up -d              # Start database (port 5433)
pnpm dev                          # Start both API and web in parallel

# Start individual apps
pnpm --filter api dev             # NestJS API on localhost:3000
pnpm --filter web dev             # Vite frontend on localhost:5173
```

### Database (Prisma)
```bash
cd apps/api
npx prisma generate               # Generate Prisma client
npx prisma migrate dev            # Run migrations
npx prisma studio                 # Open Prisma Studio GUI
npx prisma db push                # Push schema changes (dev only)
```

### Build & Test
```bash
pnpm build                        # Build all packages
pnpm --filter api build           # Build API only
pnpm --filter web build           # Build frontend only
pnpm --filter api test            # Run API tests (Jest)
pnpm --filter api test:watch      # Run tests in watch mode
```

## Architecture

### Monorepo Structure
- **pnpm workspaces** - No Turborepo, simple workspace setup
- `apps/api` - NestJS backend with Prisma ORM
- `apps/web` - React 18 + Vite frontend
- `packages/shared` - Shared TypeScript types and constants

### Backend (apps/api)
- **NestJS** modular architecture: each domain in `src/modules/`
- **PrismaService** (`src/prisma/`) - Global module, inject via constructor
- **Guards** in `src/common/guards/` - JWT auth guards
- **Decorators** in `src/common/decorators/` - Custom decorators (e.g., @CurrentUser)
- API prefix: `/api`, Swagger docs: `/api/docs`

### Frontend (apps/web)
- **Feature-based structure**: `src/features/{auth,projects,kanban,dashboard}/`
- **Zustand stores**: `src/stores/` - auth, theme, workspace state
- **TanStack Query** for server state, **Axios** for API calls (`src/services/api.ts`)
- **Layouts**: `AuthLayout` (public), `DashboardLayout` (protected)
- Path alias: `@/` maps to `src/`

### Database Models (Prisma)
Key relationships:
- User → WorkspaceMember → Workspace (multi-tenant)
- Workspace → Project → Task (hierarchy)
- Task → Task (self-referential for subtasks, 2 levels max)
- Task → TaskAssignee, Comment, ChecklistItem, Attachment

Fixed enums (no custom workflows for MVP):
- `TaskStatus`: TODO, IN_PROGRESS, DONE
- `Priority`: URGENT, HIGH, MEDIUM, LOW
- `Role`: OWNER, ADMIN, MEMBER, VIEWER

## Key Patterns

### NestJS Module Pattern
Each module has: `*.module.ts`, `*.controller.ts`, `*.service.ts`
- Controllers handle HTTP, delegate to services
- Services inject PrismaService for database access

### Frontend State
- **Auth**: Zustand with persist middleware (`auth.store.ts`)
- **Server data**: TanStack Query hooks
- **API client**: Axios instance with auth interceptor (`services/api.ts`)

### Styling
- TailwindCSS with custom component classes in `index.css`
- Dark mode via `class` strategy, controlled by `theme.store.ts`
- Component utilities: `btn`, `btn-primary`, `input`, `card`

## Environment Variables

### API (.env in apps/api)
- `DATABASE_URL` - PostgreSQL connection (port 5433 for local Docker)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - Token secrets
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth (configure later)
- `SMTP_*` - Email settings (configure later)

### Web (.env in apps/web)
- `VITE_API_URL` - API base URL (default: http://localhost:3000/api)
- `VITE_WS_URL` - WebSocket URL
