# Project State

## Project Reference

See: .context/PROJECT.md
**Core value:** UX/UI xuat sac + AI features tich hop
**Current focus:** Phase 1 - Auth & User (Backend)

## Current Position

Phase: 1 of 7 (Auth & User)
Branch: `01-feat-auth-be`
Status: Done — branch 01 hoan thanh, san sang merge
Last activity: 2026-02-28 — Code review + fix 11 issues
Progress: [####________________] 20%

## What's Done (Phase 1 BE)

- Register + Login + JWT
- Refresh token rotation + Logout (SHA-256 O(1) lookup)
- Email verification + Password reset (separate JWT secrets)
- Google OAuth login + account merging (keep LOCAL provider)
- Users module: profile CRUD, change password, avatar upload
- Code review: 11 security/performance/maintainability issues fixed

## What's Next

1. Merge 01-feat-auth-be -> main
2. Start 02-feat-auth-fe: LoginPage, RegisterPage, auth.store

## Blockers/Concerns

- (none)

## Accumulated Decisions

- Context restructured to `.context/` with GSD concepts (2026-02-27)
- Google OAuth + Email features: lam luon trong MVP (2026-02-15)
- Refresh token: Database + Cookie (2026-02-15)
- 4 AI Features tich hop vao MVP (2026-02-15)

## Session Log

### 2026-02-28

- Code review toan bo branch 01: phat hien 11 issues (security, performance, maintainability)
- Fix 11 issues qua 6 tabs + dispatcher (SHA-256 refresh, JWT secret separation, cookie DRY, etc.)
- Build passes clean
- Cap nhat PROGRESS.md + STATE.md
- Branch 01 hoan thanh, san sang merge

### 2026-02-27

- Cau truc lai context: CLAUDE.md -> `.context/` folder
- Ap dung GSD concepts: STATE.md, REQUIREMENTS.md (78 IDs), DECISIONS.md
- Tach CLAUDE.md 196 dong -> ~58 dong lean + 9 context files
- Mo rong .context/: research/, codebase/, todos/, debug/, branch template
- Nang cap 6 specs: them Verification Checklist + Edge Cases & Error Responses
- Apply template cho 01-feat-auth-be: PLAN.md, VERIFICATION.md, nang cap CONTEXT.md

### 2026-02-22

- Google OAuth login voi account merging (AUTH-05)

### 2026-02-20

- Email verification + Password reset (AUTH-06, AUTH-07, AUTH-08)
- Refresh token rotation + Logout (AUTH-03, AUTH-04)

### 2026-02-15

- Thao luan chi tiet 6 phan du an
- Quyet dinh features + 4 AI Features
- To chuc lai context/ folder

### 2026-01-26

- Claim GitHub Student Developer Pack + resources

### 2026-01-21

- Tao PROJECT_CONTEXT.md, LEARNSTART.md, PROGRESS.md
- Setup Learning Mode

---

*This file must stay under 100 lines. Move old entries to archive when needed.*
*Last updated: 2026-02-27*
