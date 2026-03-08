# Phase 1: DTOs + WorkspaceRoleGuard

> Phase nay tao cac building blocks cho Phase 2 va 3.

---

## Task 1.1: Tao DTOs

### create-workspace.dto.ts

**File:** `apps/api/src/modules/workspaces/dto/create-workspace.dto.ts`

```typescript
// Truoc khi code: doc apps/api/src/modules/auth/dto/register.dto.ts de follow pattern
```

**Fields:**
- `name`: string, required, min 2, max 50
- `slug`: string, required, min 2, max 50, regex `/^[a-z0-9-]+$/` (chi lowercase, numbers, hyphens)
- `logo`: string, optional

### update-workspace.dto.ts

**File:** `apps/api/src/modules/workspaces/dto/update-workspace.dto.ts`

Dung `PartialType(CreateWorkspaceDto)` tu `@nestjs/swagger`.

### invite-member.dto.ts

**File:** `apps/api/src/modules/workspaces/dto/invite-member.dto.ts`

**Fields:**
- `email`: string, required, valid email
- `role`: Role enum, optional, default MEMBER

### update-member-role.dto.ts

**File:** `apps/api/src/modules/workspaces/dto/update-member-role.dto.ts`

**Fields:**
- `role`: Role enum, required

### DTO index (optional)

**File:** `apps/api/src/modules/workspaces/dto/index.ts`

Re-export tat ca DTOs de import gon.

---

## Task 1.2: Tao WorkspaceRoles Decorator

**File:** `apps/api/src/common/decorators/workspace-roles.decorator.ts`

```typescript
// Pattern: SetMetadata decorator
// Key: 'workspace-roles'
// Usage: @WorkspaceRoles(Role.OWNER, Role.ADMIN)
```

**Logic:**
- Dung `SetMetadata('workspace-roles', roles)` tu @nestjs/common
- Export 1 function nhan ...Role[] args

---

## Task 1.3: Tao WorkspaceRoleGuard

**File:** `apps/api/src/common/guards/workspace-role.guard.ts`

```typescript
// Truoc khi code: doc apps/api/src/common/guards/jwt-auth.guard.ts de hieu pattern Guard
```

**Logic:**
1. Implement `CanActivate` interface
2. Inject `Reflector` va `PrismaService` qua constructor
3. Trong `canActivate()`:
   a. Lay `request` tu `context.switchToHttp().getRequest()`
   b. Lay `workspaceId` tu `request.params.id`
   c. Lay `userId` tu `request.user.id` (da set boi JwtAuthGuard chay truoc)
   d. Query `prisma.workspaceMember.findUnique({ where: { userId_workspaceId: { userId, workspaceId } } })`
   e. Neu ko tim thay → throw `ForbiddenException('Not a member of this workspace')`
   f. Lay `requiredRoles` tu `this.reflector.getAllAndOverride<Role[]>('workspace-roles', [context.getHandler(), context.getClass()])`
   g. Neu `requiredRoles` co va member.role ko nam trong list → throw `ForbiddenException('Insufficient permissions')`
   h. Attach member vao request: `request.workspaceMember = member`
   i. Return `true`

**Luu y:**
- Guard nay LUON chay SAU JwtAuthGuard: `@UseGuards(JwtAuthGuard, WorkspaceRoleGuard)`
- Neu ko co `@WorkspaceRoles()` decorator → chi check membership, ko check role cu the

---

## Verification

- [ ] `tsc --noEmit` tu `apps/api/` pass khong loi
- [ ] 4 DTO files + 1 guard + 1 decorator da tao
- [ ] Imports dung theo CONTRACTS.md

---

## Sau khi xong

Cap nhat `.context/branches/03-feat-workspace-be/PROGRESS.md`:
```markdown
## Phase 1: DTOs + WorkspaceRoleGuard

### Task 1.1: DTOs
- Status: done
- Files created: [danh sach]
- Issues found: [neu co]

### Task 1.2: WorkspaceRoles Decorator
- Status: done
- Files created: [danh sach]

### Task 1.3: WorkspaceRoleGuard
- Status: done
- Files created: [danh sach]
```

Roi bao user: "Phase 1 xong. Tiep tuc Phase 2?"
