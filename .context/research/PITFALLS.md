# Pitfalls — Cam bay can tranh

> Tong hop cac loi thuong gap khi dung tech stack cua DevTeamOS.
> Cap nhat khi gap loi moi.

---

## NestJS

| Pitfall | Mo ta | Cach tranh |
|---------|-------|------------|
| Circular dependency | Module A import Module B, Module B import Module A → crash | Dung `forwardRef(() => ModuleB)` hoac tach shared logic ra module rieng |
| Module not imported | Inject service nhung quen import module → runtime error | Luon check `imports: []` trong module file |
| Guard execution order | Guards chay theo thu tu: global → controller → route. Dat sai thu tu → bypass auth | Dat `JwtAuthGuard` truoc `RolesGuard` |
| DTO validation not working | Quen enable `ValidationPipe` global → body khong duoc validate | Them `app.useGlobalPipes(new ValidationPipe())` trong main.ts |
| Swagger decorators missing | Quen `@ApiTags()`, `@ApiResponse()` → docs khong day du | Them decorators cho moi controller/endpoint |

## Prisma

| Pitfall | Mo ta | Cach tranh |
|---------|-------|------------|
| N+1 queries | Query list items roi loop query relation → cham | Dung `include: {}` hoac `select: {}` trong 1 query |
| Migration conflicts | 2 migrations thay doi cung table → conflict | Chay `prisma migrate dev` thuong xuyen, khong de tich nhieu changes |
| Forgot prisma generate | Thay doi schema nhung quen generate → TypeScript errors | Luon chay `npx prisma generate` sau khi sua schema |
| Connection pool exhausted | Nhieu requests cung luc → het connections | Dung 1 PrismaService singleton (da setup), tang `connection_limit` neu can |
| DateTime timezone | Prisma luu UTC, frontend hien thi local → sai gio | Luon convert timezone o frontend, khong sua o DB |

## React / Frontend

| Pitfall | Mo ta | Cach tranh |
|---------|-------|------------|
| Unnecessary re-renders | Component re-render khi parent re-render → lag | Dung `React.memo`, tach component nho, Zustand selectors |
| Zustand persist hydration | Store persist tu localStorage → flash of wrong state khi load | Check `hasHydrated` truoc khi render, hoac dung `onRehydrateStorage` |
| Stale closures | useEffect/useCallback capture gia tri cu cua state → bug | Them dependencies dung vao dependency array |
| TanStack Query cache stale | Data cu hien thi vi cache chua invalidate | Dung `queryClient.invalidateQueries()` sau mutation |
| Axios interceptor loop | Refresh token interceptor goi lai chinh no → infinite loop | Check URL trong interceptor, skip /auth/refresh |
| Form uncontrolled warning | Chuyen tu controlled sang uncontrolled input → React warning | Dung React Hook Form nhat quan, khong mix controlled/uncontrolled |

## Auth / Security

| Pitfall | Mo ta | Cach tranh |
|---------|-------|------------|
| JWT token too large | Nhoi qua nhieu data vao payload → header lon, cham | Chi luu `sub` (userId) va `email`, query DB khi can them |
| Refresh token race condition | 2 tabs gui refresh cung luc → token cu bi revoke, 1 tab mat auth | Dung queue/mutex o frontend, hoac cho phep 1 lan dung token cu |
| Cookie SameSite issues | Cookie khong duoc gui cross-origin → refresh fail | Set `SameSite: 'Lax'` cho dev, `'None'` + `Secure` cho production HTTPS |
| CORS misconfiguration | Frontend khong gui duoc request → blocked by CORS | Set `origin: FRONTEND_URL`, `credentials: true` trong main.ts |
| Password hash timing | bcrypt.compare() thoi gian khac nhau → timing attack (ly thuyet) | Dung bcrypt (da chong timing attack), khong tu implement |
| Google OAuth state missing | Khong verify state param → CSRF attack | Passport.js tu xu ly, nhung check `failureRedirect` |
| Email verification token reuse | Token dung nhieu lan → security risk | Xoa token sau khi verify thanh cong |

---

*Last updated: 2026-02-27*
