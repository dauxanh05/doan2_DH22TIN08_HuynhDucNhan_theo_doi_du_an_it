---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Code Quality Rules

> Tham khao chi tiet: `.context/research/CONVENTIONS.md` va `.context/research/PITFALLS.md`

## Naming Conventions

### Backend
- Files: kebab-case — `jwt-auth.guard.ts`, `create-task.dto.ts`
- Classes: PascalCase — `AuthController`, `JwtAuthGuard`
- Methods/Variables: camelCase — `findById()`, `accessToken`
- Constants: UPPER_SNAKE_CASE — `JWT_EXPIRES_IN`
- DTOs: PascalCase + Dto — `RegisterDto`, `UpdateProfileDto`

### Frontend
- Components: PascalCase.tsx — `LoginPage.tsx`, `TaskCard.tsx`
- Hooks: camelCase.ts — `useAuth.ts`, `useTasks.ts`
- Stores: kebab-case.store.ts — `auth.store.ts`
- Services: kebab-case.ts — `api.ts`

## Import Order

```typescript
// 1. Built-in / Node.js
// 2. External packages (npm)
// 3. Internal modules (absolute imports / @/)
// 4. Relative imports
// 5. Type imports
```

## Function Rules

- Moi function lam 1 viec, ten mo ta ro rang
- Functions khong nen dai hon 40 dong — chia nho neu can
- KHONG tao abstraction cho 1-time operations
- 3 dong tuong tu OK — khong can extract helper

## Error Handling

- Backend: dung NestJS exceptions (xem backend.md)
- Frontend: catch trong Axios interceptor, show toast
- KHONG catch loi roi nuot (empty catch block)
- KHONG catch generic Error khi co the catch specific

## Code Style

- KHONG hardcode values — dung constants hoac env
- KHONG de console.log trong production code (chi khi debug)
- KHONG mix concerns: controller khong chua business logic, component khong fetch data truc tiep
- Comments bang tieng Anh, chi comment khi logic khong tu giai thich

## DRY (Don't Repeat Yourself)

- Lap 2 lan: OK
- Lap 3+ lan: extract function/component
- NHUNG khong over-abstract: interface cho 1 class, wrapper cho 1 function = thua

## Pitfalls Can Tranh

Chi tiet trong `.context/research/PITFALLS.md`. Top loi thuong gap:
- NestJS: circular dependency, missing module import, guard order
- Prisma: N+1 queries, forgot generate, migration conflicts
- React: unnecessary re-renders, stale closures, Zustand persist hydration
- Auth: JWT too large, refresh token race condition, CORS misconfiguration
