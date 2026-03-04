# Onboarding — Huong dan doc context

> **File nay danh cho AI agent.** Doc TRUOC khi bat dau lam bat ky viec gi.
> Muc tieu: hieu project dang o dau, can lam gi, doc file nao.

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

## Buoc 2: Xac dinh task hien tai

Dua vao STATE.md, xac dinh dang lam gi:

| Tinh huong | Doc them |
|------------|----------|
| Bat dau session moi, chua biet lam gi | `ROADMAP.md` — xem tien do tong the |
| Lam T1 (Orchestrator — chi plan, dieu phoi) | `ORCHESTRATOR.md` — 3-tier workflow, chia task |
| Lam T2/T3 (Chat phu — code theo prompt) | `branches/XX/PROMPT.md` + `branches/XX/CONTRACTS.md` |
| Dang code tren 1 branch cu the | `branches/XX/CONTEXT.md` + `branches/XX/PLAN.md` |
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
2. .context/branches/XX/PLAN.md        ← execution plan, tasks
3. .context/branches/XX/TODO.md        ← checklist
4. .context/specs/0X-*.md              ← spec chi tiet (neu can)
5. .context/research/PITFALLS.md       ← cam bay can tranh
6. .context/research/CONVENTIONS.md    ← coding conventions
```

### Neu dang REVIEW / VERIFY:

```
1. .context/branches/XX/VERIFICATION.md  ← checklist verify
2. .context/specs/0X-*.md > Edge Cases   ← error scenarios
3. .context/REQUIREMENTS.md              ← cap nhat status
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
| `branches/XX/PROGRESS.md` | Ghi da lam gi |
| `branches/XX/VERIFICATION.md` | Danh dau test results |
| `DECISIONS.md` | Append quyet dinh moi (neu co) |
| `codebase/STRUCTURE.md` | Cap nhat neu tao files/folders moi |
| `codebase/CONCERNS.md` | Ghi technical debt moi phat hien |

---

## Map tong quan cac file

```
.context/
├── STATE.md            ★ Doc dau tien, moi session
├── PROJECT.md          ○ Vision, tech stack
├── REQUIREMENTS.md     ○ 78 requirement IDs
├── ARCHITECTURE.md     ○ Patterns, DB schema
├── COMMANDS.md         ○ Dev commands, env vars
├── WORKFLOW.md         ○ Branch, commit conventions
├── ROADMAP.md          ○ Phases + progress
├── DECISIONS.md        ○ Decision log
├── LEARNING.md         ○ Learning mode rules
├── ORCHESTRATOR.md     ★ Doc khi lam T1 (chat chinh)
├── ONBOARDING.md       ★ File nay — doc 1 lan
│
├── research/           ◆ Nghien cuu, doc khi can
│   ├── STACK.md
│   ├── PITFALLS.md
│   └── CONVENTIONS.md
│
├── codebase/           ◆ Map code, doc khi can
│   ├── STRUCTURE.md
│   ├── CONVENTIONS.md
│   └── CONCERNS.md
│
├── specs/              ◆ Feature specs, doc khi code feature
│   └── 0X-*.md
│
├── branches/           ◆ Branch context, doc khi code branch
│   ├── _TEMPLATE/
│   └── XX-*/
│
├── todos/              ◇ Quick ideas
└── debug/              ◇ Debug sessions
```

**Legend:** ★ = luon doc | ○ = doc khi can | ◆ = doc theo task | ◇ = dung khi phat sinh

---

## Rules nho

1. **KHONG doc het tat ca files** — chi doc file lien quan den task hien tai
2. **STATE.md < 100 dong** — neu dai hon, archive entries cu
3. **DECISIONS.md chi append** — khong sua/xoa entries cu
4. **Learning Mode** — giai thich tung buoc, hoi xac nhan (xem LEARNING.md)
5. **Cuoi session** — LUON cap nhat STATE.md

---

*Last updated: 2026-02-27*
