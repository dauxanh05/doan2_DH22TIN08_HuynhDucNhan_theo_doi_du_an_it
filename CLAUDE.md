# CLAUDE.md

See @README.md for project overview
See @package.json for available scripts

## Project

DevTeamOS — webapp quan ly tien do du an cho freelancers va startup teams (2-15 nguoi). MVP tieng Viet only.

## Context Files

> Tat ca context nam trong `.context/`. **CHI doc file can thiet** — tiet kiem tokens.

### Tier 1 — LUON doc (moi session)
| File | Muc dich |
|------|----------|
| `.context/STATE.md` | **DAU moi session** — biet dang o dau, lam gi tiep |

### Tier 2 — Doc khi can (theo task)
| File | Khi nao doc |
|------|-------------|
| `.context/branches/XX/CONTEXT.md` | Khi lam viec tren branch cu the |
| `.context/branches/XX/state.json` | Resume session truoc do |
| `.context/specs/0X-*.md` | Khi code feature cu the |
| `.context/ARCHITECTURE.md` | Khi code feature moi — patterns, DB schema |
| `.context/ORCHESTRATOR.md` | **Khi lam T1 (chat chinh)** — 3-tier workflow |
| `.context/research/CONVENTIONS.md` | Coding conventions — **doc truoc khi code** |
| `.context/research/PITFALLS.md` | Cam bay can tranh — **doc truoc khi code** |

### Tier 3 — Doc khi hoi (it dung)
| File | Khi nao doc |
|------|-------------|
| `.context/PROJECT.md` | Khi can hieu tong quan du an |
| `.context/REQUIREMENTS.md` | Khi can biet requirement IDs (AUTH-01, WS-02...) |
| `.context/COMMANDS.md` | Khi can chay lenh dev/build/test, env vars |
| `.context/WORKFLOW.md` | Khi commit, merge, tao branch |
| `.context/ROADMAP.md` | Khi review tien do tong the |
| `.context/DECISIONS.md` | Khi can biet "tai sao chon X" |
| `.context/LEARNING.md` | Rules cho Learning Mode |
| `.context/research/STACK.md` | Tech stack + ly do chon |
| `.context/codebase/STRUCTURE.md` | File tree thuc te cua codebase |
| `.context/codebase/CONVENTIONS.md` | Patterns dang dung trong code |
| `.context/codebase/CONCERNS.md` | Technical debt tracking |
| `.context/todos/` | Pending ideas (1 file/todo) |
| `.context/debug/` | Debug sessions (1 file/session, hypothesis testing) |

## Rules (path-specific)

> `.claude/rules/` chua rules tu dong load theo file dang lam viec.

| Rule | Scope | Muc dich |
|------|-------|----------|
| `backend.md` | `apps/api/**/*.ts` | NestJS patterns, modules, DTOs, guards |
| `frontend.md` | `apps/web/**/*.ts,tsx` | React, Zustand, TanStack Query, Tailwind |
| `prisma.md` | `*.prisma` | Schema conventions, relations, enums |
| `shared.md` | `packages/shared/**` | Shared types, export patterns |
| `anti-hallucination.md` | `**/*.ts,tsx` | **BAT BUOC** — doc code truoc khi viet, khong tu bia |
| `code-quality.md` | `**/*.ts,tsx` | Naming, DRY, function rules, pitfalls |
| `review-checklist.md` | `**/*.ts,tsx` | Security, performance, architecture checklist khi review |
| `nestjs-patterns.md` | `apps/api/**/*.ts` (module/ctrl/svc/guard) | Deep patterns: guards, pagination, transactions, ownership |
| `prisma-patterns.md` | `*.prisma`, `apps/api/prisma/**` | Deep patterns: migrations, relations, queries, indexes |
| `react-patterns.md` | `apps/web/**/*.ts,tsx` | Deep patterns: TanStack Query, Zustand, forms, error handling |

## Installed Plugins (wshobson/agents marketplace)

| Plugin | Commands | Khi nao dung |
|--------|----------|-------------|
| `comprehensive-review` | `/full-review`, `/pr-enhance` | Review code da viet, nang cao PR |
| `javascript-typescript` | Skills: TS types, Node.js patterns | Tu dong activate khi code TS |
| `backend-development` | `/feature-development` | Khi lam feature BE moi |
| `conductor` | `/conductor:setup`, `:new-track`, `:implement`, `:status` | Project management workflow |
| `debugging-toolkit` | `/smart-debug` | Khi gap bug kho |
| `git-pr-workflows` | Git automation, PR enhancement | Khi commit, tao PR |

## Agent Rules

0. **Lan dau lam viec voi project nay? Doc `.context/ONBOARDING.md`**
1. **Doc `.context/STATE.md` DAU moi session** — hieu current position
2. **Cap nhat `.context/STATE.md` CUOI moi session** — ghi lai da lam gi
3. **Tuan thu Learning Mode** — giai thich tung buoc, hoi xac nhan (xem `.context/LEARNING.md`)
4. Khi code branch: doc `.context/branches/XX/CONTEXT.md`
5. Khi code feature: doc `.context/specs/0X-*.md`
6. Ghi quyet dinh quan trong vao `.context/DECISIONS.md` (append-only)
7. Cap nhat requirement status trong `.context/REQUIREMENTS.md` khi hoan thanh
8. **CHONG HALLUCINATION** — doc code thuc te TRUOC khi viet, kiem tra imports ton tai, follow CONTRACTS.md neu co
9. **CHONG CODE XAU** — doc `research/CONVENTIONS.md` + `research/PITFALLS.md` truoc khi code

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
