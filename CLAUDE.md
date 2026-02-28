# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

DevTeamOS — webapp quan ly tien do du an cho freelancers va startup teams (2-15 nguoi). MVP tieng Viet only.

## Context Files

> Tat ca context nam trong `.context/`. Doc file can thiet thay vi load het.

| File | Khi nao doc |
|------|-------------|
| `.context/STATE.md` | **DAU moi session** — biet dang o dau, lam gi tiep |
| `.context/PROJECT.md` | Khi can hieu tong quan du an |
| `.context/REQUIREMENTS.md` | Khi can biet requirement IDs (AUTH-01, WS-02...) |
| `.context/ARCHITECTURE.md` | Khi code feature moi — patterns, DB schema |
| `.context/COMMANDS.md` | Khi can chay lenh dev/build/test, env vars |
| `.context/WORKFLOW.md` | Khi commit, merge, tao branch |
| `.context/ROADMAP.md` | Khi review tien do tong the |
| `.context/DECISIONS.md` | Khi can biet "tai sao chon X" |
| `.context/LEARNING.md` | Rules cho Learning Mode |
| `.context/specs/0X-*.md` | Khi code feature cu the |
| `.context/branches/XX/CONTEXT.md` | Khi lam viec tren branch cu the |
| `.context/research/STACK.md` | Tech stack + ly do chon |
| `.context/research/PITFALLS.md` | Cam bay can tranh (NestJS, Prisma, React, Auth) |
| `.context/research/CONVENTIONS.md` | Coding conventions (naming, imports, errors, API format) |
| `.context/codebase/STRUCTURE.md` | File tree thuc te cua codebase |
| `.context/codebase/CONVENTIONS.md` | Patterns dang dung trong code |
| `.context/codebase/CONCERNS.md` | Technical debt tracking |
| `.context/todos/` | Pending ideas (1 file/todo) |
| `.context/debug/` | Debug sessions (1 file/session, hypothesis testing) |

## Agent Rules

0. **Lan dau lam viec voi project nay? Doc `.context/ONBOARDING.md`** — huong dan doc context theo tung tinh huong
1. **Doc `.context/STATE.md` DAU moi session** — hieu current position
2. **Cap nhat `.context/STATE.md` CUOI moi session** — ghi lai da lam gi, tiep theo gi
3. **Tuan thu Learning Mode** — giai thich tung buoc, hoi xac nhan (xem `.context/LEARNING.md`)
4. Khi code branch: doc `.context/branches/XX/CONTEXT.md`
5. Khi code feature: doc `.context/specs/0X-*.md`
6. Ghi quyet dinh quan trong vao `.context/DECISIONS.md` (append-only)
7. Cap nhat requirement status trong `.context/REQUIREMENTS.md` khi hoan thanh

## Key Patterns

### Backend (NestJS)
- Module pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`
- Controllers handle HTTP, delegate to services
- Services inject PrismaService for database access
- API prefix: `/api`, Swagger: `/api/docs`

### Frontend (React)
- Feature-based: `src/features/{name}/`
- Zustand stores: `src/stores/`
- TanStack Query for server state
- Axios with auth interceptor: `src/services/api.ts`
- Path alias: `@/` = `src/`

## Commit Convention

Format: `type(scope): message`

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`
Scopes: `auth`, `workspace`, `project`, `task`, `ai`, `kanban`, `realtime`, `dashboard`, `prisma`, `shared`, `deploy`
