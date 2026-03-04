---
name: debug
description: Analyze bugs and suggest fixes with step-by-step debugging approach. Use when encountering errors or unexpected behavior.
---

# Debug Helper

Analyze bugs systematically and suggest fixes with explanations.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Error message, file path, or description

## Pre-flight (BAT BUOC)

1. Doc `.context/research/PITFALLS.md` — kiem tra co phai cam bay da biet
2. Doc `.context/codebase/STRUCTURE.md` — hieu file tree
3. Doc `.context/codebase/CONVENTIONS.md` — patterns dang dung

## Instructions

### Step 1: Gather information
Ask if not provided:
1. "Error message chính xác là gì?"
2. "Bug xảy ra ở file/endpoint nào?"
3. "Có reproduce được không?"
4. "Gần đây có thay đổi gì?"

### Step 2: Read actual code (KHONG SKIP)

- DOC file bi loi — khong doan
- DOC files lien quan (imports, dependencies)
- DOC schema.prisma neu lien quan DB
- Check `package.json` neu nghi loi dependency

### Step 3: Check known pitfalls

Doc `.context/research/PITFALLS.md` va kiem tra:

**NestJS**: Missing @Injectable, circular dependency, wrong module imports, missing async/await, guard order
**Prisma**: Missing await, wrong include, N+1 queries, forgot generate
**React**: Missing useEffect deps, stale closures, Zustand persist hydration
**Auth**: Cookie SameSite, CORS misconfiguration, refresh token race condition

### Step 4: Report analysis

```
## Bug Analysis

### Problem Summary
[1-2 sentence description]

### Root Cause
**What:** [What's wrong]
**Where:** [File:line]
**Why:** [Why it happens]
**Known pitfall?** [Yes/No — reference PITFALLS.md if applicable]

### Suggested Fix
[code block]

### Explanation
[Why this fix works]
```

### Step 5: Interactive debugging
Ask:
- "Bạn có muốn tôi apply fix này không?"
- "Bạn hiểu tại sao bug xảy ra chưa?"

## Debugging Strategies

1. **Read error carefully** — Error messages often point to solution
2. **Check recent changes** — `git diff`
3. **Check known pitfalls** — `.context/research/PITFALLS.md`
4. **Binary search** — Comment out half the code
5. **Console.log** — Strategic logging at key points

## After Completion

Remind user:
- "Nhớ update PROGRESS.md!"
- "Có muốn ghi lesson learned vào PITFALLS.md không?" (nếu bug mới)
