# Project State

## Project Reference

See: .context/PROJECT.md
**Core value:** UX/UI xuat sac + AI features tich hop
**Current focus:** Phase 1 - Auth & User

## Current Position

Phase: 1 of 7 (Auth & User)
Branch: `02-feat-auth-fe`
Status: Backend auth hardened and validated, frontend auth branch dang tiep tuc
Last activity: 2026-03-06 — Fix 7 auth security issues, tao Prisma migration, dang them regression tests
Progress: [####________________] 20%

## What's Done (Phase 1 BE)

- Register + Login + JWT
- Refresh token rotation + Logout (SHA-256 O(1) lookup)
- Email verification + Password reset (separate JWT secrets)
- Google OAuth login + account merging (keep LOCAL provider)
- Users module: profile CRUD, change password, avatar upload
- Code review: 11 security/performance/maintainability issues fixed
- Auth hardening: path traversal fix, global + route auth throttling, single-use reset token nonce
- Google OAuth token-in-URL removed: redirect one-time code + backend exchange endpoint
- Refresh token cleanup + refresh rotation transaction + DB indexes applied via Prisma migration

## What's Next

1. Hoan thanh auth regression tests cho refresh/reset/google exchange
2. Tiep tuc 02-feat-auth-fe: LoginPage, RegisterPage, auth.store

## Blockers/Concerns

- Chua co test coverage auth day du; dang bo sung regression tests

## Accumulated Decisions

- Context restructured to `.context/` with GSD concepts (2026-02-27)
- Google OAuth + Email features: lam luon trong MVP (2026-02-15)
- Refresh token: Database + Cookie (2026-02-15)
- 4 AI Features tich hop vao MVP (2026-02-15)
- Auth hardening session: NestJS CacheModule cho Google one-time code exchange + strict throttling (2026-03-06)

## Session Log

### 2026-03-06

- Review + fix 7 auth security issues sau debug session
- Fix path traversal trong avatar deletion
- Them global throttling va route-specific limits cho register/login/forgot-password
- Password reset token thanh single-use voi `resetNonce`
- Google OAuth redirect doi tu token URL sang one-time code + exchange endpoint
- Refresh token cleanup, transaction-based rotation, them indexes `userId+revoked` va `expiresAt`
- Tao va apply Prisma migration `20260306104557_auth_security_fixes`
- Prisma generate + `nest build` pass; auth regression tests dang duoc bo sung

### 2026-02-28

- Code review toan bo branch 01: phat hien 11 issues (security, performance, maintainability)
- Fix 11 issues qua 6 tabs + dispatcher (SHA-256 refresh, JWT secret separation, cookie DRY, etc.)
- Build passes clean
- Cap nhat PROGRESS.md + STATE.md
- Branch 01 hoan thanh, san sang merge

---

*This file must stay under 100 lines. Move old entries to archive when needed.*
*Last updated: 2026-03-06*
