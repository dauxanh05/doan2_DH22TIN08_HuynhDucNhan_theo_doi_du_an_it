---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Review Checklist

> Extracted from comprehensive-review + security-auditor patterns.
> Dung khi review code (T1 review, hoac tu-review truoc khi commit).

## Security (OWASP-aware)

- [ ] Input validation: DTO dung class-validator, khong trust raw input
- [ ] SQL injection: dung Prisma parameterized queries, KHONG raw SQL
- [ ] XSS: React auto-escape, KHONG dung `dangerouslySetInnerHTML`
- [ ] Auth: routes can bao ve co `@UseGuards(JwtAuthGuard)`
- [ ] Authorization: kiem tra user co quyen tren resource (ownership check)
- [ ] Secrets: KHONG hardcode API keys, passwords trong code — dung env vars
- [ ] CORS: chi allow `FRONTEND_URL`, khong dung `origin: '*'`
- [ ] Rate limiting: endpoints nhay cam (login, register, forgot-pw) co throttle

## Performance

- [ ] N+1 queries: dung `include`/`select` thay vi loop query
- [ ] Pagination: list endpoints co `page` + `limit`, KHONG tra het data
- [ ] Unnecessary re-renders (FE): Zustand selectors, React.memo khi can
- [ ] Bundle size (FE): KHONG import toan bo library (`import { x } from 'lib'`)
- [ ] Database indexes: fields thuong query/filter nen co `@index` trong schema

## Architecture

- [ ] Separation of concerns: controller KHONG chua business logic
- [ ] Single responsibility: 1 service method lam 1 viec
- [ ] Module boundaries: KHONG import truc tiep tu module khac — dung exports
- [ ] Error handling: dung NestJS exceptions, KHONG custom error format
- [ ] API consistency: response format thong nhat (xem CONVENTIONS.md)

## Code Quality

- [ ] Naming: theo conventions (kebab-case files, PascalCase classes, camelCase methods)
- [ ] Functions < 40 dong — chia nho neu dai hon
- [ ] KHONG console.log trong production code
- [ ] KHONG empty catch blocks — xu ly hoac re-throw
- [ ] Imports ton tai va dung thu tu (built-in → external → internal → relative → types)
- [ ] TypeScript: KHONG dung `any` — dung proper types hoac `unknown`
