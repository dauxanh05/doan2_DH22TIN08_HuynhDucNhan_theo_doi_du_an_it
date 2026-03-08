# PROMPT — Branch 03-feat-workspace-be

> T2 Feature Chat. Lam theo tung phase, HOI xac nhan sau moi phase.

---

## Doc truoc khi bat dau (BAT BUOC)

```
1. .context/branches/03-feat-workspace-be/CONTRACTS.md  ← interfaces, imports, patterns
2. .context/specs/02-workspace-team.md                   ← full specs + edge cases
3. .context/research/CONVENTIONS.md                      ← coding rules
4. .context/research/PITFALLS.md                         ← cam bay
5. Doc code thuc te:
   - apps/api/src/modules/auth/auth.controller.ts        ← controller pattern
   - apps/api/src/modules/auth/auth.service.ts           ← service pattern
   - apps/api/src/modules/auth/dto/register.dto.ts       ← DTO pattern
   - apps/api/src/common/guards/jwt-auth.guard.ts        ← guard pattern
   - apps/api/src/common/decorators/current-user.decorator.ts ← decorator pattern
   - apps/api/src/modules/email/email.service.ts         ← email usage
   - apps/api/src/modules/workspaces/workspaces.module.ts   ← skeleton hien tai
   - apps/api/src/modules/workspaces/workspaces.service.ts  ← skeleton hien tai
   - apps/api/src/modules/workspaces/workspaces.controller.ts ← skeleton hien tai
   - apps/api/prisma/schema.prisma                       ← Workspace, WorkspaceMember, WorkspaceInvitation models
```

---

## Phases (lam TUAN TU — hoi xac nhan giua moi phase)

### Phase 1: DTOs + WorkspaceRoleGuard
Doc `.context/branches/03-feat-workspace-be/phases/01-dtos-guard.md`

### Phase 2: Workspace CRUD (5 endpoints)
Doc `.context/branches/03-feat-workspace-be/phases/02-workspace-crud.md`

### Phase 3: Members + Invitation (5 endpoints)
Doc `.context/branches/03-feat-workspace-be/phases/03-members-invite.md`

---

## Rules

1. Follow CONTRACTS.md CHINH XAC — ko tu bia import/function
2. Kiem tra import TON TAI truoc khi dung
3. Code comments tieng ANH
4. KHONG tao file ngoai scope — hoi user truoc
5. KHONG commit — de user review
6. Cap nhat `.context/branches/03-feat-workspace-be/PROGRESS.md` sau MOI phase
7. Giai thich tung buoc (Learning Mode)
8. KHONG sua schema.prisma — models da co san
9. Error handling: dung NestJS exceptions truc tiep (ConflictException, ForbiddenException, NotFoundException, BadRequestException)
10. Response: tra ve data truc tiep, KHONG wrap `{ data: ... }`
