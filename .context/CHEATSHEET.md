# Cheat Sheet — Claude Code Workflow

> Tham khao nhanh cac commands, plugins, agents, skills. In ra hoac pin lai.

---

## 1. Workflow moi session

```
1. Mo CLI session moi
   $ claude

2. Claude tu doc STATE.md → biet dang o dau

3. Chon cach lam:
   a) Code truc tiep → Claude tu follow rules
   b) Dung Conductor → /conductor:new-track → /conductor:implement
   c) Dung Orchestrator 3-tier → doc ORCHESTRATOR.md

4. Sau khi code xong:
   → /full-review <path>        (review 3 goc nhin)
   → /security-sast             (scan bao mat)
   → /commit                    (commit)
   → /pr-enhance                (tao PR)
```

---

## 2. Huong dan su dung Step-by-Step

### Tong quan: Ban da co gi?

| Thu | Da cai | Muc dich |
|-----|--------|----------|
| 22 plugins | wshobson/agents | Agents + skills chuyen biet (review, test, debug, ...) |
| 4 custom agents | `.claude/agents/` | devteam-reviewer, devteam-tester, devteam-arch-checker, devteam-doc-writer |
| 4 hooks | `.claude/settings.json` | PreToolUse: check imports. PostToolUse: prettier + tsc type check + audit log |
| 10 rules | `.claude/rules/` | Tu dong load theo file dang edit (backend, frontend, prisma...) |
| Skills | from plugins + `.claude/skills/` | `/full-review`, `/smart-debug`, `/feature-development`, ... |
| Agent Teams | plugin agent-teams | Chay nhieu agents song song |
| 2 MCP Servers | github + postgres | Truy van DB truc tiep, quan ly GitHub issues/PRs |

---

### Buoc 1: Mo Claude Code CLI

Mo terminal, vao project, chay `claude`:

```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM
git checkout 02-feat-auth-fe   # hoac branch ban can lam
claude
```

Claude Code tu dong doc `CLAUDE.md` khi khoi dong — file nay chua context reference, agent rules, anti-hallucination rules.

**Viec dau tien trong moi session** — nho Claude doc context cho branch hien tai:

```
Doc .context/STATE.md, .context/branches/02/CONTEXT.md,
.context/branches/02/TODO.md
```

Dieu nay giup Claude biet:
- Project dang o phase nao (STATE.md)
- Branch nay can lam gi, scope gi (CONTEXT.md)
- Checklist cu the (TODO.md)

---

### Buoc 2: Code tung task theo TODO.md

Gia su TODO.md co checklist:
```
Phase 1: Foundation
- [ ] Tao src/services/api.ts — Axios instance + interceptor
- [ ] Tao src/stores/auth.store.ts — Zustand auth store
- [ ] Tao src/components/ProtectedRoute.tsx
- [ ] Cap nhat router — them auth routes
```

Bao Claude lam **tung task mot**:

```
Bat dau task dau tien: Tao src/services/api.ts.
Doc code BE auth.controller.ts truoc de biet API endpoints.
```

Hooks tu dong chay khi Claude code:
1. **PreToolUse hook** — khi Claude viet/edit file .ts/.tsx, hook tu check imports co hop le khong
2. **PostToolUse hook** — sau khi edit, prettier format + `tsc --noEmit` tu chay check TypeScript errors
3. **Audit hook** — log moi Bash command vao .claude/audit.log
4. Ban khong can lam gi — hooks chay tu dong o background

---

### Buoc 3: Dung Custom Agents (sau khi code xong)

Sau khi code xong 1 feature, goi agents de review/test/check.

#### 3a. Review code — devteam-reviewer

```
Dung devteam-reviewer agent review code auth vua tao.
Scope: apps/web/src/features/auth/ va apps/web/src/stores/auth.store.ts
```

Agent se:
- Doc `.context/research/CONVENTIONS.md` + `PITFALLS.md`
- Check 4 goc nhin: Security, Architecture, Performance, Code Quality
- Tra ve report voi severity levels (CRITICAL > WARNING > SUGGESTION)

#### 3b. Viet tests — devteam-tester

```
Dung devteam-tester agent viet unit tests cho auth.store.ts va useLogin.ts
```

Agent se:
- Doc source file truoc
- Tao `*.spec.ts` voi mock phu hop
- Cover happy path + error cases
- Follow AAA pattern (Arrange → Act → Assert)

#### 3c. Check architecture — devteam-arch-checker

```
Dung devteam-arch-checker agent verify toan bo auth frontend.
```

Agent se:
- Check tat ca imports co ton tai khong
- Check React structure (feature-based)
- Check khong co circular dependencies
- Tra ve bang PASS/FAIL

#### 3d. Update docs — devteam-doc-writer

```
Dung devteam-doc-writer agent update STATE.md va PROGRESS.md
voi nhung gi da lam hom nay.
```

Agent se auto update tracking files, ban khong can tu viet.

---

### Buoc 4: Dung Plugin Commands

Cac plugins cung cap slash commands. Hay dung nhat:

```
/full-review apps/web/src/       ← comprehensive-review plugin, review toan dien
/smart-debug "error message"     ← debugging-toolkit plugin, debug loi
/feature-development "mo ta"     ← backend-development plugin, lam feature BE
/conductor:status                ← xem tien do project
/pr-enhance                      ← tao PR description chi tiet
```

**Khac biet custom agents vs plugins:**
- `devteam-reviewer` — custom agent, BIET DevTeamOS context (Prisma, NestJS patterns rieng, conventions). Dung cho **review hang ngay**.
- `/full-review` — plugin generic, review rat chi tiet nhung khong biet project-specific patterns. Dung **truoc khi merge**.
- **Ket hop ca hai** de review toan dien nhat.

---

### Buoc 5: Dung Agent Teams (cho task lon)

Agent Teams = nhieu agents lam song song. Dung khi task lon co the chia nho.

**Vi du 1:** Code LoginPage + RegisterPage cung luc:

```
Tao agent team de implement song song:
- Agent 1: Implement LoginPage.tsx + LoginForm.tsx + useLogin.ts
- Agent 2: Implement RegisterPage.tsx + RegisterForm.tsx + useRegister.ts
Ca hai doc CONTEXT.md va CONTRACTS.md cua branch 02 truoc khi code.
```

**Vi du 2:** Review da chieu song song:

```
/team-review apps/web/src/ --reviewers security,performance,architecture
```

**Vi du 3:** Debug nhieu hypothesis:

```
/team-debug "Login page tra ve 401" --hypotheses 3
```

**Plugin commands cho teams:**

```
/team-spawn              ← tao team agents
/team-feature "task"     ← nhieu agents lam feature song song
/team-review src/        ← nhieu agents review song song
/team-debug "bug"        ← nhieu agents debug song song
/team-status             ← xem trang thai team
/team-shutdown           ← tat team
```

**Khi nao dung Agent Teams:**
- Task lon chia nho duoc, files INDEPENDENT (khong cung edit 1 file)
- Muon lam song song tiet kiem thoi gian
- Review da chieu (security + performance + architecture cung luc)
- Debug phuc tap (nhieu hypothesis song song)

**Khi nao KHONG dung:**
- Task nho (1-2 files) — overhead khong dang
- Files co dependency lan nhau — se conflict
- Task can verify truoc khi tiep (tuan tu)

---

### Buoc 6: Ket thuc session

Nho Claude cap nhat context:

```
Dung devteam-doc-writer agent update STATE.md, PROGRESS.md,
va check off TODO.md items da xong.
```

Hoac thu cong:
```
Cap nhat STATE.md session log hom nay.
Danh dau TODO.md cac items da xong.
```

---

### Workflow tong hop cho 1 session

```
1. Mo CLI:       claude
2. Load context: "Doc STATE.md + CONTEXT.md + TODO.md cho branch hien tai"
3. Code:         Lam tung task trong TODO.md
                 ↳ Hooks tu chay: check imports (PreToolUse) + prettier + tsc (PostToolUse)
4. Review:       devteam-reviewer review code vua viet
5. Test:         devteam-tester viet tests
6. Arch check:   devteam-arch-checker verify architecture
7. Ket thuc:     devteam-doc-writer update STATE + PROGRESS + TODO
```

### Workflow khi dung Agent Teams

```
1. Mo CLI:       claude
2. Load context: "Doc STATE.md + CONTEXT.md + TODO.md"
3. Plan:         Chia tasks doc lap, xac dinh file ownership
4. Spawn team:   /team-feature "task lon" hoac natural language
5. Monitor:      /team-status de xem tien do
6. Review:       /team-review hoac devteam-reviewer
7. Merge:        /full-review + /pr-enhance
8. Ket thuc:     devteam-doc-writer update docs
```

---

## 3. Commands theo phase

### Moi session (dung thuong xuyen)

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/smart-debug "<bug>"` | Debug co he thong, hypothesis testing | `/smart-debug "Login API tra ve 500"` |
| `/full-review <path>` | Review 3 goc nhin: architect + code + security | `/full-review apps/api/src/modules/auth/` |
| `/conductor:status` | Xem tien do project | `/conductor:status` |
| `/error-analysis` | Phan tich loi sau, tim root cause | `/error-analysis` |
| `/error-trace` | Trace stack trace, tim nguon loi | `/error-trace` |

### Khi bat dau feature moi

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/conductor:new-track "<ten>"` | Tao spec.md + plan.md cho feature | `/conductor:new-track "Workspace CRUD"` |
| `/conductor:implement <track>` | Execute plan tung buoc | `/conductor:implement workspace-crud` |
| `/feature-development "<mo ta>"` | Lam feature BE end-to-end (API design → code → test) | `/feature-development "Task management API"` |
| `/component-scaffold` | Tao React component co san structure | `/component-scaffold` |

### Khi lam DB

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/sql-migrations` | Tao va quan ly database migrations | `/sql-migrations` |
| `/migration-observability` | Monitor migration performance | `/migration-observability` |

### Khi test

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/test-generate` | Tao unit tests tu dong (Jest) | `/test-generate` |
| `/tdd-cycle` | Full TDD: red → green → refactor | `/tdd-cycle` |
| `/tdd-red` | Viet test FAIL truoc | `/tdd-red` |
| `/tdd-green` | Viet code PASS test | `/tdd-green` |
| `/tdd-refactor` | Refactor giu tests PASS | `/tdd-refactor` |

### Khi review / truoc merge

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/full-review <path>` | Review da goc nhin | `/full-review apps/api/src/` |
| `/pr-enhance` | Viet PR description chi tiet tu dong | `/pr-enhance` |
| `/security-sast` | Static security scan | `/security-sast` |
| `/security-hardening` | Kiem tra bao mat toan dien | `/security-hardening` |
| `/multi-agent-review` | Nhieu agents review cung luc | `/multi-agent-review` |

### Agent Teams

| Command | Lam gi | Vi du |
|---------|--------|-------|
| `/team-spawn` | Tao team agents | `/team-spawn` |
| `/team-review` | Nhieu agents review song song | `/team-review src/ --reviewers security,performance` |
| `/team-debug` | Nhieu agents debug song song | `/team-debug "API returns 500" --hypotheses 3` |
| `/team-feature` | Nhieu agents lam feature song song | `/team-feature "Add OAuth2" --plan-first` |
| `/team-status` | Xem trang thai team | `/team-status` |
| `/team-shutdown` | Tat team | `/team-shutdown` |

---

## 4. Custom Agents — 4 agents cho DevTeamOS

| Agent | Khi nao dung | Cach goi |
|-------|-------------|----------|
| `devteam-reviewer` | Sau khi code xong, truoc merge | "Dung devteam-reviewer review [scope]" |
| `devteam-tester` | Can viet tests | "Dung devteam-tester viet tests cho [file]" |
| `devteam-arch-checker` | Sau khi them module moi | "Dung devteam-arch-checker verify [scope]" |
| `devteam-doc-writer` | Cuoi session | "Dung devteam-doc-writer update docs" |

**Khac biet Custom Agents vs Plugins:**

| | Custom Agents | Plugin Agents |
|---|---|---|
| Context | Biet DevTeamOS patterns, conventions, Prisma schema | Generic, khong biet project-specific |
| Khi dung | Review hang ngay, checks nhanh | Review sau (truoc merge), generic tasks |
| Vi du | `devteam-reviewer` biet check Zustand selectors, NestJS guards | `/full-review` check generic code quality |
| Ket hop | **Dung ca hai**: custom agent truoc, plugin sau de double-check |

---

## 5. Skills tu dong activate

Skills KHONG can goi bang command — Claude tu activate khi context phu hop:

| Tinh huong | Skills tu dong load |
|------------|---------------------|
| Lam viec voi TypeScript generics/types | `typescript-advanced-types` |
| Code Node.js backend | `nodejs-backend-patterns` |
| Code React state | `react-state-management` |
| Lam Tailwind UI | `tailwind-design-system` |
| Thiet ke API | `api-design-principles` |
| Code auth (JWT, OAuth) | `auth-implementation-patterns` |
| Toi uu SQL queries | `sql-optimization-patterns` |
| Xu ly errors | `error-handling-patterns` |
| Review code | `code-review-excellence` |
| Lam voi PostgreSQL | `postgresql` |

---

## 6. Rules tu dong load (10 files)

| Khi edit file trong... | Rules duoc load |
|------------------------|-----------------|
| `apps/api/**` (NestJS) | backend + nestjs-patterns + anti-hallucination + code-quality + review-checklist |
| `apps/web/**` (React) | frontend + react-patterns + anti-hallucination + code-quality + review-checklist |
| `*.prisma` | prisma + prisma-patterns |
| `packages/shared/**` | shared |

→ Khong can load thu cong, Claude tu biet.

---

## 7. Hooks tu dong chay (4 hooks)

| Hook | Event | Lam gi |
|------|-------|--------|
| `pre-write-imports.sh` | PreToolUse (Write/Edit) | Check imports ton tai truoc khi viet file |
| `post-write-format.sh` | PostToolUse (Write/Edit) | Auto format voi Prettier |
| `post-write-typecheck.sh` | PostToolUse (Write/Edit) | Chay `tsc --noEmit` check TypeScript errors |
| `post-bash-audit.sh` | PostToolUse (Bash) | Log commands vao audit.log |

→ Tat ca chay tu dong, ban khong can lam gi.

---

## 8. Context Files — 3 Tiers

```
Tier 1 (LUON doc):    STATE.md
Tier 2 (Khi can):     branches/XX/CONTEXT.md, specs/0X-*.md, ARCHITECTURE.md,
                      ORCHESTRATOR.md, research/CONVENTIONS.md, research/PITFALLS.md
Tier 3 (Hiem khi):    PROJECT.md, REQUIREMENTS.md, COMMANDS.md, WORKFLOW.md,
                      ROADMAP.md, DECISIONS.md, LEARNING.md
```

---

## 9. MCP Servers

| Server | Muc dich | Vi du su dung |
|--------|----------|---------------|
| GitHub | Quan ly issues, PRs, reviews | Claude tu truy van khi can |
| PostgreSQL | Query DB truc tiep | Claude co the check data, verify schema |

---

## 10. Patterns nhanh

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

## 11. Debug Checklist

```
Gap bug? Thu theo thu tu:
1. Doc error message ky → thuong co goi y
2. /smart-debug "mo ta bug"       → agent phan tich
3. /error-analysis                → root cause analysis
4. /error-trace                   → trace stack trace
5. Check PITFALLS.md              → loi thuong gap?
6. /team-debug "bug" --hypotheses 3  → nhieu agents debug song song
```

---

## 12. Review Checklist (tom tat)

```
Security:  [ ] Input validation  [ ] Auth guards  [ ] Ownership check  [ ] No hardcoded secrets
Perf:      [ ] No N+1 queries    [ ] Pagination    [ ] Zustand selectors  [ ] DB indexes
Arch:      [ ] Controller thin   [ ] Service 1 job  [ ] Module boundaries  [ ] NestJS exceptions
Quality:   [ ] Naming OK         [ ] Functions <40 lines  [ ] No console.log  [ ] No `any`
```

---

## 13. Workflow theo tung branch

| Branch | Commands chinh |
|--------|----------------|
| **02-auth-fe** | `/component-scaffold`, agents: devteam-reviewer + devteam-tester |
| **03-workspace-be** | `/feature-development`, `/sql-migrations` |
| **04-workspace-fe** | `/component-scaffold`, agents |
| **05-project-task-be** | `/feature-development`, `/sql-migrations` |
| **06-project-task-fe** | `/component-scaffold` |
| **07-ai-be** | `/feature-development` |
| **08-ai-fe** | `/component-scaffold` |
| **09-kanban-fe** | `/component-scaffold` |
| **10-realtime-be** | `/feature-development` |
| **11-realtime-fe** | `/component-scaffold` |
| **12-dashboard-be** | `/feature-development` |
| **13-dashboard-fe** | `/component-scaffold` |
| **14-polish** | `/refactor-clean`, `/tech-debt`, `/deps-audit`, `/full-review` |
| **15-deploy** | `/workflow-automate`, `/config-validate`, `/security-hardening` |
| **Truoc moi merge** | devteam-reviewer + `/full-review` + `/security-sast` + `/pr-enhance` |

---

*Created: 2026-03-04*
*Updated: 2026-03-05 — them custom agents, hooks moi, agent team workflow, step-by-step guide*
*File: .context/CHEATSHEET.md*
