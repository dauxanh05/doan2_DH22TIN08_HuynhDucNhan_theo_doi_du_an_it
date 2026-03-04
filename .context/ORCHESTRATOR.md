# Orchestrator Workflow — 3-Tier Chat System

> **File nay danh cho T1 (Chat Chinh).** Doc file nay khi bat dau session orchestrator.
> T1 CHI plan + dieu phoi. KHONG code truc tiep.

---

## Kien truc 3 tang

| Tang | Ten | Vai tro | Tool |
|------|-----|---------|------|
| **T1** | Orchestrator | Plan, chia task, tao prompt, review ket qua | Claude Code CLI session 1 |
| **T2** | Feature Chat | Implement 1 feature/module theo PROMPT.md | Claude Code CLI session 2 |
| **T3** | Micro Chat | Implement 1 unit nho theo phases/XX.md | Claude Code CLI session 3 |

---

## T1 — Quy trinh Orchestrator

### Buoc 1: Doc context

```
Doc theo thu tu:
1. .context/STATE.md          — dang o dau
2. .context/ROADMAP.md        — tien do tong the
3. .context/branches/XX/CONTEXT.md  — scope branch hien tai
4. .context/branches/XX/PLAN.md     — execution plan
5. .context/branches/XX/PROGRESS.md — da lam gi
```

### Buoc 2: Chia tasks cho T2

1. Xac dinh tasks can lam (tu PLAN.md hoac TODO.md)
2. Voi MOI task:
   - Xac dinh scope ro rang (lam gi, KHONG lam gi)
   - Doc code thuc te de tao CONTRACTS.md
   - Viet PROMPT.md cho T2
   - Neu task lon: tao phases/ subfolder voi sub-prompts cho T3

### Buoc 3: Tao files cho T2

```
.context/branches/XX/
├── PROMPT.md              ← T1 viet cho T2
├── CONTRACTS.md           ← T1 doc code roi viet (interfaces, imports, patterns)
└── phases/                ← Chi tao neu task can chia nho hon
    ├── 01-ten-task.md     ← Sub-prompt cho T3
    ├── 02-ten-task.md
    └── ...
```

### Buoc 4: Huong dan user

Output cho user:
```
Task da chia xong. Ban lam theo thu tu:

1. Mo CLI session moi
2. Paste: "Doc .context/branches/XX/PROMPT.md roi lam theo"
3. Khi T2 xong → quay lai day bao
4. Toi se review ket qua
```

### Buoc 5: Review ket qua

Khi T2 bao xong:
1. Doc PROGRESS.md — biet T2 da lam gi
2. Mo CLI session review:
   - Paste: "Review code da thay doi tren branch XX. Doc .context/research/CONVENTIONS.md va .context/research/PITFALLS.md. Kiem tra code quality, ghi ket qua vao .context/branches/XX/REVIEW.md"
3. Doc REVIEW.md — xem co issue khong
4. Neu co issues → tao fix task (PROMPT moi hoac bao user)
5. Neu OK → cap nhat TODO.md, STATE.md, REQUIREMENTS.md

### Buoc 6: Cap nhat context

Cuoi session T1:
- Cap nhat STATE.md (current position, session log)
- Cap nhat REQUIREMENTS.md (danh dau [x] neu xong)
- Cap nhat ROADMAP.md (% tien do)
- Cap nhat TODO.md (danh dau tasks da xong)

---

## T2 — Quy trinh Feature Chat

### Khi bat dau

T2 nhan prompt tu user: "Doc .context/branches/XX/PROMPT.md roi lam theo"

T2 phai:
1. Doc PROMPT.md — hieu scope
2. Doc CONTRACTS.md — biet interfaces/types bat buoc
3. Doc code thuc te cua CAC FILE lien quan — KHONG gia dinh
4. Doc research/CONVENTIONS.md — coding rules
5. Doc research/PITFALLS.md — cam bay can tranh

### Khi code

- Follow CONTRACTS.md chinh xac
- Neu can import module/function → kiem tra no TON TAI truoc
- Neu can tao file moi ngoai danh sach → HOI user truoc
- Code comments bang tieng Anh
- Giai thich bang tieng Viet (Learning Mode)

### Khi task lon — Chia T3

Neu 1 task co nhieu buoc:
1. Doc phases/ folder — neu T1 da tao sub-prompts
2. Hoac tu chia va bao user mo CLI session moi cho T3
3. T3 lam xong → T2 kiem tra ket qua

### Khi xong

1. Cap nhat PROGRESS.md:
   - Files da tao/sua
   - Endpoints (neu co)
   - Issues phat hien (neu co)
   - Luu y cho task tiep theo
2. KHONG commit — de user review truoc
3. Bao user: "Da xong, quay lai T1 de review"

---

## T3 — Quy trinh Micro Chat

### Khi bat dau

T3 nhan prompt tu user: "Doc .context/branches/XX/phases/NN-ten.md roi lam theo"

T3 phai:
1. Doc sub-prompt — hieu scope nho
2. Doc CONTRACTS.md — interfaces bat buoc
3. Doc code thuc te — KHONG gia dinh
4. Lam DUNG 1 unit duoc giao, KHONG lam them

### Khi xong

1. Cap nhat PROGRESS.md (append, khong ghi de)
2. KHONG commit
3. Bao user: "Da xong phase NN"

---

## Rules chong Hallucination

### BAT BUOC

1. **Doc code truoc khi viet** — Moi chat (T2/T3) PHAI doc file thuc te truoc khi sua/tao
2. **Follow CONTRACTS.md** — Khong tu bua import, function, interface
3. **Kiem tra ton tai** — Truoc khi import module/function, doc file do de confirm no co
4. **Khong gia dinh API** — Neu khong biet function signature → doc source code
5. **Hoi khi khong chac** — Thay vi doan → hoi user

### CAM

- Khong import module chua co trong codebase
- Khong goi function chua ton tai
- Khong gia dinh database schema — doc schema.prisma
- Khong tu tao file moi ngoai scope
- Khong thay doi file ngoai scope

---

## Rules chong Code kho bao tri

### BAT BUOC

1. **Follow patterns hien tai** — Doc codebase/CONVENTIONS.md, lam theo cach code da co
2. **Naming conventions** — Doc research/CONVENTIONS.md
3. **Error handling** — Dung NestJS exceptions (400, 401, 403, 404, 409)
4. **DRY nhung khong over-abstract** — Lap 2 lan OK, lap 3+ thi extract
5. **Small functions** — Moi function lam 1 viec, ten mo ta ro

### CAM

- Khong viet function dai hon 50 dong ma khong chia nho
- Khong hardcode values — dung constants hoac env
- Khong bo qua error handling
- Khong mix concerns (controller khong chua business logic)

---

## Song song vs Tuan tu

### Chay tuan tu khi:
- Task B phu thuoc output cua Task A (vd: service xong moi lam controller)
- 2 tasks sua cung 1 file
- Task can verify truoc khi tiep

### Chay song song khi:
- 2 tasks doc lap (vd: 2 endpoints khac nhau khong share logic)
- BE va FE tren 2 branches khac nhau
- Code va docs

### T1 quyet dinh — ghi ro trong PROMPT.md:
```markdown
## Thu tu
- Task 1 → Task 2 (tuan tu, Task 2 can output tu Task 1)
- Task 3 + Task 4 (song song, doc lap)
```

---

## State Tracking (tu Conductor pattern)

> Moi branch co the co file `state.json` de track tien do, resume across sessions.

### File: `.context/branches/XX/state.json`

```json
{
  "branch": "XX-type-name",
  "status": "in_progress | blocked | review | done",
  "current_phase": 1,
  "current_task": "ten task dang lam",
  "completed_tasks": ["task-1", "task-2"],
  "blockers": [],
  "started_at": "ISO_TIMESTAMP",
  "last_updated": "ISO_TIMESTAMP"
}
```

### Khi nao update:
- T2/T3 bat dau task → set `current_task`
- T2/T3 xong task → push vao `completed_tasks`
- Gap blocker → set `status: "blocked"`, ghi `blockers`
- T1 review OK → set `status: "done"`

---

## Phase Checkpoints (tu full-review pattern)

> Dung lai cho user confirm truoc khi chuyen phase. Tranh lam sai huong.

### Khi nao checkpoint:
1. **Sau khi chia tasks** (T1) → xac nhan scope voi user
2. **Sau moi phase** (T2) → verify truoc khi tiep
3. **Truoc khi merge** → review toan bo

### Format checkpoint:
```
=== CHECKPOINT: Phase X hoan thanh ===
Da lam: [danh sach]
Tiep theo: [danh sach]
Van de: [neu co]

Ban xac nhan tiep tuc? (Y/N)
```

---

## Structured Output cho T2/T3 (tu Conductor pattern)

> Thay vi PROGRESS.md tu do, T2/T3 output theo format nay:

### File: `.context/branches/XX/PROGRESS.md`

```markdown
## Phase X: [ten phase]

### Task X.1: [ten task]
- Status: done | in_progress | blocked
- Files changed: [danh sach file]
- Endpoints added: [neu co]
- Issues found: [neu co]
- Notes: [luu y cho task tiep]

### Task X.2: [ten task]
...
```

---

## Plugin Commands huu ich

> Cac plugins da install, co the dung trong workflow:

| Command | Khi nao dung |
|---------|-------------|
| `/comprehensive-review:full-review src/` | T1 review code da viet |
| `/comprehensive-review:pr-enhance` | Truoc khi tao PR |
| `/debugging-toolkit:smart-debug` | Khi gap bug kho |
| `/conductor:status` | Xem tien do project |
| `/backend-development:feature-development` | Khi lam feature BE moi |
| `/git-pr-workflows:pr-enhance` | Nang cao PR description |

---

## Checklist T1 — Moi session

- [ ] Doc STATE.md
- [ ] Xac dinh tasks can lam
- [ ] Doc code thuc te lien quan
- [ ] Tao/cap nhat CONTRACTS.md
- [ ] Tao/cap nhat PROMPT.md
- [ ] Tao phases/ (neu can)
- [ ] Huong dan user cach chay T2/T3
- [ ] **CHECKPOINT**: Xac nhan scope voi user truoc khi T2 bat dau
- [ ] Review ket qua khi T2/T3 xong (co the dung `/full-review`)
- [ ] Cap nhat state.json + STATE.md cuoi session

---

*Created: 2026-02-28*
*Updated: 2026-03-04 — them state tracking, phase checkpoints, structured output, plugin commands*
