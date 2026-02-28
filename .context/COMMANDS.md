# Commands: DevTeamOS

---

## Development

```bash
# Start all services (requires Docker for PostgreSQL)
docker compose up -d              # Start database (port 5433)
pnpm dev                          # Start both API and web in parallel

# Start individual apps
pnpm --filter api dev             # NestJS API on localhost:3000
pnpm --filter web dev             # Vite frontend on localhost:5173
```

## Database (Prisma)

```bash
cd apps/api
npx prisma generate               # Generate Prisma client
npx prisma migrate dev            # Run migrations
npx prisma studio                 # Open Prisma Studio GUI
npx prisma db push                # Push schema changes (dev only)
```

## Build & Test

```bash
pnpm build                        # Build all packages
pnpm --filter api build           # Build API only
pnpm --filter web build           # Build frontend only
pnpm --filter api test            # Run API tests (Jest)
pnpm --filter api test:watch      # Run tests in watch mode
```

---

## Environment Variables

### API (.env in apps/api)

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

### Web (.env in apps/web)

```env
VITE_API_URL="http://localhost:3000/api"
VITE_WS_URL="ws://localhost:3000"
```

---

*Last updated: 2026-02-27*
