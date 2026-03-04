# Cheat Sheet — Claude Code Workflow

> Tham khao nhanh cac commands va patterns. In ra hoac pin lai.

---

## Plugin Commands

| Command | Muc dich | Vi du |
|---------|----------|-------|
| `/full-review <path>` | Review code 3 goc nhin (architect + code + security) | `/full-review apps/api/src/modules/auth/` |
| `/smart-debug "<mo ta>"` | Debug co he thong, hypothesis testing | `/smart-debug "Login API tra ve 500"` |
| `/feature-development "<mo ta>"` | Lam feature BE end-to-end | `/feature-development "Workspace CRUD"` |
| `/conductor:new-track "<ten>"` | Tao spec + plan cho feature moi | `/conductor:new-track "Auth Frontend"` |
| `/conductor:implement <track>` | Execute plan theo thu tu | `/conductor:implement auth-fe` |
| `/conductor:status` | Xem tien do project | `/conductor:status` |
| `/pr-enhance` | Viet PR description tu dong | `/pr-enhance` |
| `/commit` | Tao commit message tu staged changes | `/commit` |

---

## Rules tu dong load (10 files)

| Khi edit file trong... | Rules duoc load |
|------------------------|-----------------|
| `apps/api/**` (NestJS) | backend + nestjs-patterns + anti-hallucination + code-quality + review-checklist |
| `apps/web/**` (React) | frontend + react-patterns + anti-hallucination + code-quality + review-checklist |
| `*.prisma` | prisma + prisma-patterns |
| `packages/shared/**` | shared |

→ Khong can load thu cong, Claude tu biet.

---

## Workflow moi session

```
1. Mo CLI session moi
   $ claude

2. Claude tu doc STATE.md → biet dang o dau

3. Chon cach lam:
   a) Code truc tiep → Claude tu follow rules
   b) Dung Conductor → /conductor:new-track → /conductor:implement
   c) Dung Orchestrator 3-tier → doc ORCHESTRATOR.md

4. Sau khi code xong:
   → /full-review <path>        (review)
   → /commit                    (commit)
   → /pr-enhance                (tao PR)
```

---

## Context Files — 3 Tiers

```
Tier 1 (LUON doc):    STATE.md
Tier 2 (Khi can):     branches/XX/CONTEXT.md, specs/0X-*.md, ARCHITECTURE.md,
                      ORCHESTRATOR.md, research/CONVENTIONS.md, research/PITFALLS.md
Tier 3 (Hiem khi):    PROJECT.md, REQUIREMENTS.md, COMMANDS.md, WORKFLOW.md,
                      ROADMAP.md, DECISIONS.md, LEARNING.md
```

---

## Patterns nhanh

### NestJS — tao module moi
```
1. Tao xxx.module.ts, xxx.controller.ts, xxx.service.ts
2. Register trong app.module.ts imports
3. Them @ApiTags('xxx') trong controller
4. Tao DTOs trong dto/ subfolder
5. Them @UseGuards(JwtAuthGuard) cho routes can auth
```

### React — tao feature moi
```
1. Tao src/features/{name}/pages/XxxPage.tsx
2. Tao src/features/{name}/components/Yyy.tsx
3. Tao src/hooks/useXxx.ts (TanStack Query hook)
4. (Neu can) Tao src/stores/xxx.store.ts (Zustand)
5. Register route trong router
```

### Prisma — them model moi
```
1. Them model trong schema.prisma
2. Them relations + indexes
3. pnpm db:migrate --name ten-migration
4. pnpm db:generate
5. Verify: pnpm db:studio
```

---

## Debug Checklist

```
Gap bug? Thu theo thu tu:
1. Doc error message ky → thuong co goi y
2. /smart-debug "mo ta bug"  → de agent phan tich
3. Check PITFALLS.md → co phai loi thuong gap?
4. Doc code thuc te → khong doan
5. Test hypothesis tung cai mot
```

---

## Review Checklist (tom tat)

```
Security:  [ ] Input validation  [ ] Auth guards  [ ] Ownership check  [ ] No hardcoded secrets
Perf:      [ ] No N+1 queries    [ ] Pagination    [ ] Zustand selectors  [ ] DB indexes
Arch:      [ ] Controller thin   [ ] Service 1 job  [ ] Module boundaries  [ ] NestJS exceptions
Quality:   [ ] Naming OK         [ ] Functions <40 lines  [ ] No console.log  [ ] No `any`
```

---

*Created: 2026-03-04*
*File: .context/CHEATSHEET.md*
