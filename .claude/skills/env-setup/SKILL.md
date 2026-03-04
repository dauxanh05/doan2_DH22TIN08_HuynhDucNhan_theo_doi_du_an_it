---
name: env-setup
description: Check and setup development environment including Docker, database, and env files. Use when starting development or debugging environment issues.
---

# Environment Setup

Check and setup development environment for DevTeamOS project.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Optional: "check", "fix", "reset"

## Pre-flight

Doc `.context/COMMANDS.md` — day du commands va env vars.

## Quick Start

```bash
docker compose up -d       # Start PostgreSQL (port 5433)
pnpm dev                   # Start both API + Web
```

## Step 1: Check Prerequisites

```bash
node --version    # >= 18.x
pnpm --version    # >= 8.x
docker info       # Docker running
```

## Step 2: Check Environment Files

```
Required:
1. apps/api/.env         ← copy from .env.example
2. apps/web/.env         ← optional

If missing: cp apps/api/.env.example apps/api/.env
```

Key env vars (see `.context/COMMANDS.md` for full list):
- `DATABASE_URL` — PostgreSQL connection (port 5433)
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — Auth secrets
- `GOOGLE_CLIENT_ID/SECRET` — OAuth (optional for dev)
- `FRONTEND_URL` — CORS origin (http://localhost:5173)

## Step 3: Check Docker + Database

```bash
docker compose up -d                    # Start PostgreSQL
docker compose logs postgres            # Check logs
cd apps/api && npx prisma migrate dev   # Run migrations
npx prisma generate                     # Generate client
npx prisma studio                       # GUI (optional)
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| DB connection refused | `docker compose restart` |
| Prisma client outdated | `cd apps/api && npx prisma generate` |
| Node modules broken | `rm -rf node_modules apps/*/node_modules && pnpm install` |

## Access URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Prisma Studio: `npx prisma studio`

## Full Reset

```bash
docker compose down -v
rm -rf node_modules apps/*/node_modules
pnpm install
docker compose up -d
cd apps/api && npx prisma migrate dev
```

## After Setup

Remind user: "Environment ready! Start dev: `pnpm dev`"
