---
name: env-setup
description: Check and setup development environment including Docker, database, and env files. Use when starting development or debugging environment issues.
---

# Environment Setup

Check and setup development environment for DevTeamOS project.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Optional: "check", "fix", "reset"

## Quick Start

```bash
# Start database
docker compose up -d

# Start development (both API and web)
pnpm dev
```

## Step 1: Check Prerequisites

```
🔍 Environment Check

1. Node.js: >= 18.x
2. pnpm: >= 8.x
3. Docker: Running
```

Commands:
```bash
node --version
pnpm --version
docker info
```

## Step 2: Check Environment Files

```
📁 Environment Files

1. apps/api/.env
2. apps/web/.env (optional)
```

If missing:
```bash
cp apps/api/.env.example apps/api/.env
```

## Step 3: Check Docker Services

```
🐳 Docker Services

PostgreSQL (port 5433): docker compose ps
```

Commands:
```bash
docker compose up -d
docker compose logs postgres
```

## Step 4: Check Database

```bash
cd apps/api
npx prisma migrate dev
npx prisma generate
npx prisma studio  # GUI
```

## Common Issues & Fixes

### Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Database connection refused
```bash
docker compose restart
docker compose logs postgres
```

### Prisma client outdated
```bash
cd apps/api
npx prisma generate
```

### Node modules issues
```bash
rm -rf node_modules apps/*/node_modules
pnpm install
```

## Quick Commands

### Start Development
```bash
docker compose up -d      # Start PostgreSQL (port 5433)
pnpm dev                  # Start API + Web

# Or separately:
pnpm --filter api dev     # http://localhost:3000
pnpm --filter web dev     # http://localhost:5173
```

### Access URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Prisma Studio: `npx prisma studio`

### Full Reset
```bash
docker compose down -v
rm -rf node_modules apps/*/node_modules
pnpm install
docker compose up -d
cd apps/api && npx prisma migrate dev
```

## After Setup

Remind user:
- "Environment ready! 🚀"
- "Start dev: `pnpm dev`"
- "API docs: http://localhost:3000/api/docs"
