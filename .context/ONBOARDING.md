# Onboarding — Huong dan doc context

> **File nay danh cho AI agent.** Doc TRUOC khi bat dau lam bat ky viec gi.
> Muc tieu: hieu project dang o dau, can lam gi, doc file nao.

---

## Reading order nhanh

| Tinh huong | Thu tu doc de xuat |
|------------|--------------------|
| Session moi | `STATE.md` → `ROADMAP.md` (neu can biet tong quan) |
| Plan / thao luan | `STATE.md` → `PROJECT.md` → `REQUIREMENTS.md` → `ROADMAP.md` → `DECISIONS.md` |
| Code tren branch | `STATE.md` → `branches/XX/CONTEXT.md` → `branches/XX/PROMPTS.md` → `branches/XX/state.json` → `specs/0X-*.md` |
| Review / verify | `STATE.md` → `branches/XX/PROGRESS.md` → `specs/0X-*.md` → `REQUIREMENTS.md` |
| Debug | `STATE.md` → `research/PITFALLS.md` → `codebase/STRUCTURE.md` → `codebase/CONVENTIONS.md` |

---

## Buoc 1: Doc STATE.md (BAT BUOC)

```
Doc: .context/STATE.md
```

File nay cho biet:
- Dang o phase nao, branch nao
- Da lam gi, tiep theo lam gi
- Co blocker nao khong
- Session truoc dung o dau

> **Neu chi doc 1 file duy nhat, doc file nay.**

---

## Source of truth

| Can biet gi | File uu tien doc |
|-------------|-------------------|
| Trang thai hien tai / session moi nhat | `STATE.md` |
| Vision, muc tieu, stack tong quan | `PROJECT.md` |
| Architecture, patterns, DB schema | `ARCHITECTURE.md` |
| Requirement chinh thuc va status | `REQUIREMENTS.md` |
| Tien do phase / roadmap tong the | `ROADMAP.md` |
| Workflow branch / commit / merge | `WORKFLOW.md` |
| Quy trinh dieu phoi T1 | `ORCHESTRATOR.md` |
| Scope va rules cua 1 branch cu the | `branches/XX/CONTEXT.md` |
| Prompts cho T2 tabs lam viec | `branches/XX/PROMPTS.md` |
| Tien do chi tiet cua branch | `branches/XX/PROGRESS.md` |
| Trang thai resume session (phase, tasks) | `branches/XX/state.json` |
| Interfaces/types/contracts bat buoc | `branches/XX/CONTRACTS.md` |
| Sub-prompts tung phase cho T3 | `branches/XX/phases/NN-ten.md` |
| Cau truc code thuc te | `codebase/STRUCTURE.md` |
| Coding conventions / pitfalls | `research/CONVENTIONS.md`, `research/PITFALLS.md` |

---

## Buoc 2: Xac dinh task hien tai

Dua vao STATE.md, xac dinh dang lam gi:

| Tinh huong | Doc them |
|------------|----------|
| Bat dau session moi, chua biet lam gi | `ROADMAP.md` — xem tien do tong the |
| Lam T1 (Orchestrator — chi plan, dieu phoi) | `ORCHESTRATOR.md` — 3-tier workflow, chia task |
| Lam T2/T3 (Chat phu — code theo prompt) | `branches/XX/PROMPTS.md` + `branches/XX/CONTRACTS.md` |
| Dang code tren 1 branch cu the | `branches/XX/CONTEXT.md` + `branches/XX/state.json` |
| Bat dau feature moi | `specs/0X-*.md` — spec chi tiet cua feature |
| Can hieu architecture | `ARCHITECTURE.md` |
| Can chay lenh | `COMMANDS.md` |
| Can commit/merge/tao branch | `WORKFLOW.md` |
| Can biet tai sao chon X | `DECISIONS.md` |
| Can biet requirement nao da xong | `REQUIREMENTS.md` |

---

## Buoc 3: Doc file tuong ung voi task

### Neu dang CODE tren 1 branch:

```
1. .context/branches/XX/CONTEXT.md     ← scope, decisions, rules
2. .context/branches/XX/PROMPTS.md     ← T1/T2/T3 prompts + task breakdown
3. .context/branches/XX/CONTRACTS.md   ← interfaces, imports, patterns bat buoc
4. .context/branches/XX/state.json     ← resume state: phase, completed tasks
5. .context/specs/0X-*.md              ← spec chi tiet (neu can)
6. .context/research/PITFALLS.md       ← cam bay can tranh
7. .context/research/CONVENTIONS.md    ← coding conventions
```

### Neu dang REVIEW / VERIFY:

```
1. .context/branches/XX/PROGRESS.md    ← da lam gi, issues phat hien
2. .context/specs/0X-*.md > Edge Cases ← error scenarios
3. .context/REQUIREMENTS.md            ← cap nhat status
```

### Neu dang DEBUG:

```
1. .context/research/PITFALLS.md       ← kiem tra co phai cam bay da biet
2. .context/codebase/STRUCTURE.md      ← hieu file tree
3. .context/codebase/CONVENTIONS.md    ← patterns dang dung
4. Tao file debug session: .context/debug/NNN-ten-bug.md
```

### Neu dang PLAN / THAO LUAN:

```
1. .context/PROJECT.md                 ← vision, tech stack
2. .context/REQUIREMENTS.md            ← danh sach requirements
3. .context/ROADMAP.md                 ← phases + tien do
4. .context/DECISIONS.md               ← quyet dinh da co
```

---

## Buoc 4: Sau khi lam xong — CAP NHAT

Truoc khi ket thuc session, cap nhat cac file sau:

| File | Cap nhat gi |
|------|-------------|
| `STATE.md` | Current position, last activity, session log |
| `REQUIREMENTS.md` | Danh dau [x] requirements da hoan thanh |
| `ROADMAP.md` | Cap nhat % tien do |
| `branches/XX/PROGRESS.md` | Ghi da lam gi (format structured: Task, Status, Files, Issues) |
| `branches/XX/state.json` | Phase hien tai, completed_tasks, blockers |
| `DECISIONS.md` | Append quyet dinh moi (neu co) |
| `codebase/STRUCTURE.md` | Cap nhat neu tao files/folders moi |
| `codebase/CONCERNS.md` | Ghi technical debt moi phat hien |

---

## Map tong quan cac file

```
.context/
├── STATE.md            ★ Doc dau tien, moi session
├── PROJECT.md          ○ Vision, tech stack
├── REQUIREMENTS.md     ○ Requirement IDs + status chinh thuc
├── ARCHITECTURE.md     ○ Patterns, DB schema
├── COMMANDS.md         ○ Dev commands, env vars
├── WORKFLOW.md         ○ Branch, commit conventions
├── ROADMAP.md          ○ Phases + progress
├── DECISIONS.md        ○ Decision log (append-only)
├── LEARNING.md         ○ Learning mode rules
├── ORCHESTRATOR.md     ★ Doc khi lam T1 (chat chinh)
├── CHEATSHEET.md       ○ Workflow nhanh cho Claude Code
├── ONBOARDING.md       ★ File nay — map + huong dan vao context
│
├── research/           ◆ Kien thuc nen, doc truoc khi code neu can
│   ├── STACK.md
│   ├── PITFALLS.md
│   └── CONVENTIONS.md
│
├── codebase/           ◆ Map codebase thuc te
│   ├── STRUCTURE.md
│   ├── CONVENTIONS.md
│   └── CONCERNS.md
│
├── specs/              ◆ Feature specs theo domain
│   ├── overview.md
│   └── 0X-*.md
│
├── branches/           ◆ Branch context, doc khi code branch
│   ├── README.md
│   ├── _TEMPLATE/      ← Mau files: CONTEXT, CONTRACTS, PLAN, PROGRESS, etc.
│   └── XX-*/
│       ├── CONTEXT.md    ← scope, rules, decisions
│       ├── CONTRACTS.md  ← interfaces, imports, patterns bat buoc
│       ├── PROMPTS.md    ← T1/T2/T3 prompts + task breakdown
│       ├── PROGRESS.md   ← structured progress log
│       ├── state.json    ← resume state (phase, tasks, blockers)
│       └── phases/       ← sub-prompts cho T3 (NN-ten-task.md)
│
├── todos/              ◇ Quick ideas / pending items
└── debug/              ◇ Debug sessions / hypothesis logs
```

**Legend:** ★ = luon doc | ○ = doc khi can | ◆ = doc theo task | ◇ = dung khi phat sinh

### Ghi chu map

- `CHEATSHEET.md` nghieng ve thao tac nhanh / workflow, khong thay the `STATE.md`.
- `specs/overview.md` la overview cua phan specs / project scope, **khong** phai index chinh cua toan bo `.context/`.
- `branches/_TEMPLATE/` chua cac mau file cho branch context moi (CONTEXT, CONTRACTS, PLAN, PROGRESS, TODO, VERIFICATION, REVIEW).
- Pattern thuc te (tu branch 02): dung `PROMPTS.md` + `phases/` + `state.json` thay vi `PLAN.md` + `TODO.md` + `VERIFICATION.md`.
- `branches/XX/` (folder khong co suffix) la folder lam viec thuc te; `branches/XX-type-name/` la folder context co the ton tai song song.

---

## Legacy notes

- Chuan hien tai cua project la duong dan **`.context/...`**.
- Neu gap reference dang `context/...` hoac `context/overview.md`, xem do la **dau vet cu / legacy reference**.
- Khi doc va cap nhat tai lieu moi, uu tien dung `.context/...` de tranh nham lan.

---

## Rules nho

1. **KHONG doc het tat ca files** — chi doc file lien quan den task hien tai
2. **STATE.md < 100 dong** — neu dai hon, archive entries cu
3. **DECISIONS.md chi append** — khong sua/xoa entries cu
4. **Learning Mode** — giai thich tung buoc, hoi xac nhan (xem LEARNING.md)
5. **Cuoi session** — LUON cap nhat STATE.md

---

*Last updated: 2026-03-07*
