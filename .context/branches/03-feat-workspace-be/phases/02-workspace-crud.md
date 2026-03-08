# Phase 2: Workspace CRUD (5 endpoints)

> Phase nay implement 5 CRUD endpoints cho Workspace.
> Can Phase 1 hoan thanh truoc (DTOs + Guard).

---

## Task 2.1: Update workspaces.service.ts

**File:** `apps/api/src/modules/workspaces/workspaces.service.ts`

```typescript
// Truoc khi code: doc apps/api/src/modules/auth/auth.service.ts de follow service pattern
// SKELETON da co — chi can them methods, ko tao file moi
```

**Them methods:**

### create(userId, dto)
```
- Check slug unique: prisma.workspace.findUnique({ where: { slug } })
  → Neu ton tai: throw ConflictException('Workspace slug already exists')
- Transaction:
  const workspace = await prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({ data: { name, slug, logo } });
    await tx.workspaceMember.create({
      data: { userId, workspaceId: ws.id, role: 'OWNER' }
    });
    return ws;
  });
- Return workspace
```

### findAllByUser(userId)
```
- Query: prisma.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true },
  })
- Map ket qua: return members.map(m => ({
    ...m.workspace,
    role: m.role,
  }))
```

### findById(workspaceId)
```
- Query: prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
      }
    }
  })
- Neu ko tim thay: throw NotFoundException('Workspace not found')
- Return workspace
```

### update(workspaceId, dto)
```
- Neu dto.slug thay doi:
  - Check unique: prisma.workspace.findFirst({ where: { slug: dto.slug, NOT: { id: workspaceId } } })
  - Neu ton tai: throw ConflictException('Workspace slug already exists')
- Update: prisma.workspace.update({ where: { id: workspaceId }, data: dto })
- Return updated workspace
```

### delete(workspaceId)
```
- prisma.workspace.delete({ where: { id: workspaceId } })
  (cascade se tu dong xoa members, invitations)
- Return { message: 'Workspace deleted successfully' }
```

---

## Task 2.2: Update workspaces.controller.ts

**File:** `apps/api/src/modules/workspaces/workspaces.controller.ts`

```typescript
// Truoc khi code: doc apps/api/src/modules/auth/auth.controller.ts de follow controller pattern
// SKELETON da co — thay the health endpoint
```

**Thay doi:**
- Xoa `@Get('health')` endpoint cu
- Them class-level decorators: `@UseGuards(JwtAuthGuard)`, `@ApiBearerAuth()`
- Inject `WorkspacesService` qua constructor

**5 endpoints:**

```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Create a new workspace' })
create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto)

@Get()
@ApiOperation({ summary: 'List user workspaces' })
findAll(@CurrentUser('id') userId: string)

@Get(':id')
@UseGuards(WorkspaceRoleGuard)
@ApiOperation({ summary: 'Get workspace details' })
findOne(@Param('id') id: string)

@Patch(':id')
@UseGuards(WorkspaceRoleGuard)
@WorkspaceRoles(Role.OWNER, Role.ADMIN)
@ApiOperation({ summary: 'Update workspace' })
update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto)

@Delete(':id')
@UseGuards(WorkspaceRoleGuard)
@WorkspaceRoles(Role.OWNER)
@ApiOperation({ summary: 'Delete workspace' })
delete(@Param('id') id: string)
```

**Luu y:**
- `findAll` ko can WorkspaceRoleGuard (query theo userId, ko theo workspaceId)
- `create` ko can WorkspaceRoleGuard (chua co workspace nao)
- `findOne` chi can membership (ko can specific role)

---

## Task 2.3: Update workspaces.module.ts (neu can)

**File:** `apps/api/src/modules/workspaces/workspaces.module.ts`

Kiem tra:
- PrismaService — Global, ko can import
- EmailService — Global, ko can import
- ConfigService — Global, ko can import
- **Co the ko can thay doi module file**

---

## Verification

- [ ] `nest build` pass
- [ ] Test voi Postman:
  - POST /api/workspaces — tao workspace, verify OWNER membership auto
  - POST /api/workspaces — tao voi slug trung → 409
  - GET /api/workspaces — list workspaces cua user
  - GET /api/workspaces/:id — xem chi tiet (phai la member)
  - GET /api/workspaces/:id — user khac (ko phai member) → 403
  - PATCH /api/workspaces/:id — OWNER/ADMIN update → 200
  - PATCH /api/workspaces/:id — MEMBER/VIEWER update → 403
  - DELETE /api/workspaces/:id — OWNER → 200
  - DELETE /api/workspaces/:id — ADMIN → 403

---

## Sau khi xong

Cap nhat PROGRESS.md, roi bao user: "Phase 2 xong. Tiep tuc Phase 3?"
