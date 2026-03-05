# 01-feat-auth-be — Context

> **Type:** feat | **Phase:** 1 | **Depends on:** 00-chore-foundation (merged)

---

## Scope

Toan bo backend authentication va user management.

- **Requirements:** AUTH-01..AUTH-13
- **Modules:** auth, users, email
- **Common:** jwt-auth.guard, current-user.decorator

## References

- Spec: `.context/specs/01-auth-user.md`
- Architecture: `.context/ARCHITECTURE.md`
- Pitfalls: `.context/research/PITFALLS.md` > Auth/Security section
- Conventions: `.context/research/CONVENTIONS.md`

## API Endpoints

### Auth Module (`src/modules/auth/`)

```
POST   /auth/register              # AUTH-01
POST   /auth/login                 # AUTH-02
POST   /auth/logout                # AUTH-04
POST   /auth/refresh               # AUTH-03
GET    /auth/google                # AUTH-05
GET    /auth/google/callback       # AUTH-05
POST   /auth/forgot-password       # AUTH-07
POST   /auth/reset-password        # AUTH-08
GET    /auth/verify-email/:token   # AUTH-06
```

### Users Module (`src/modules/users/`)

```
GET    /users/me                   # AUTH-09
PATCH  /users/me                   # AUTH-09
PATCH  /users/me/password          # AUTH-10
POST   /users/me/avatar            # AUTH-11
```

## Decisions (branch-specific)

| Decision | Rationale |
|----------|-----------|
| bcrypt cho password hash | Industry standard, chong timing attack |
| Access token 15 phut | Ngan du de an toan, refresh token bu dap |
| Refresh token random string (khong JWT) | Luu DB de co the revoke, khong can decode |
| HTTP-only cookie cho refresh token | Frontend khong access duoc, chong XSS |
| Token rotation moi lan refresh | Chong replay attack |
| Google OAuth merge voi existing email | 1 user co the login ca 2 cach |
| Email verify token het han 24h | Du thoi gian, khong qua lau |
| Reset password token het han 1h | Ngan hon vi security sensitive |

## Rules

- Password hash: bcrypt (saltRounds = 10)
- Access token: JWT 15 phut, payload chi chua { sub, email }
- Refresh token: crypto.randomBytes(64), hash truoc khi luu DB
- Cookie: httpOnly, secure (production), sameSite: 'lax', maxAge: 7 days
- Google OAuth: can GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- Email: Nodemailer voi SMTP credentials
- Validation: class-validator + class-transformer (ValidationPipe global)

## Dependencies

- **Depends on:** `00-chore-foundation` (Prisma schema, Docker, env) — MERGED
- **Blocks:** `02-feat-auth-fe` (frontend can backend auth xong)

---

*Created: 2026-02-16 | Updated: 2026-02-27*
