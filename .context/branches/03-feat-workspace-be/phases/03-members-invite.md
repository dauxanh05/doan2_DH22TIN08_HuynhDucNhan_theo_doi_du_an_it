# Phase 3: Members + Invitation (5 endpoints)

> Phase nay implement member management va email invitation flow.
> Can Phase 2 hoan thanh truoc (CRUD endpoints).

---

## Task 3.1: Them member methods vao workspaces.service.ts

**File:** `apps/api/src/modules/workspaces/workspaces.service.ts` (tiep tuc modify)

### getMembers(workspaceId)
```
- Query: prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } }
    },
    orderBy: { joinedAt: 'asc' },
  })
- Return array
```

### inviteMember(workspaceId, dto, inviterUserId)
```
- Lay workspace name: prisma.workspace.findUnique({ where: { id: workspaceId }, select: { name: true } })

- Check email da la member chua:
  - Tim user by email: prisma.user.findUnique({ where: { email: dto.email } })
  - Neu co user → check membership: prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId } }
    })
  - Neu da la member → throw ConflictException('User is already a member')

- Check invitation pending:
  - prisma.workspaceInvitation.findUnique({
      where: { workspaceId_email: { workspaceId, email: dto.email } }
    })
  - Neu ton tai → throw ConflictException('Invitation already sent')

- Ko cho moi voi role OWNER:
  - if (dto.role === 'OWNER') throw ForbiddenException('Cannot invite as OWNER')

- Generate token: crypto.randomBytes(32).toString('hex')
  - Import: import { randomBytes } from 'crypto';

- Create invitation:
  prisma.workspaceInvitation.create({
    data: {
      workspaceId,
      email: dto.email,
      role: dto.role || 'MEMBER',
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
  })

- Send email:
  const frontendUrl = this.configService.get<string>('FRONTEND_URL');
  const inviteUrl = `${frontendUrl}/invite/${token}`;
  await this.emailService.sendMail(
    dto.email,
    `Moi tham gia workspace "${workspaceName}" - DevTeamOS`,
    `
      <h2>Ban duoc moi tham gia workspace!</h2>
      <p>Ban da duoc moi tham gia workspace "<strong>${workspaceName}</strong>" tren DevTeamOS.</p>
      <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">
        Tham gia workspace
      </a>
      <p>Link nay se het han sau 7 ngay.</p>
    `
  );

- Return { message: 'Invitation sent successfully' }
```

### removeMember(workspaceId, targetUserId)
```
- Check target la OWNER ko:
  prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: targetUserId, workspaceId } }
  })
  - Neu role === 'OWNER' → throw ForbiddenException('Cannot remove workspace owner')
  - Neu ko tim thay → throw NotFoundException('Member not found')

- Delete: prisma.workspaceMember.delete({
    where: { userId_workspaceId: { userId: targetUserId, workspaceId } }
  })

- Return { message: 'Member removed successfully' }
```

### updateMemberRole(workspaceId, targetUserId, dto)
```
- Check target:
  const member = prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: targetUserId, workspaceId } }
  })
  - Neu ko tim thay → throw NotFoundException('Member not found')
  - Neu member.role === 'OWNER' → throw ForbiddenException('Cannot change owner role')

- Ko cho set role thanh OWNER:
  - if (dto.role === 'OWNER') throw ForbiddenException('Cannot assign OWNER role')

- Update: prisma.workspaceMember.update({
    where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    data: { role: dto.role },
  })

- Return updated member
```

### joinByToken(token, userId)
```
- Find invitation: prisma.workspaceInvitation.findUnique({ where: { token } })
  - Neu ko tim thay → throw NotFoundException('Invitation not found')

- Check expiry:
  - if (invitation.expiresAt < new Date()) throw BadRequestException('Invitation expired')

- Check user da la member chua:
  const existing = prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: invitation.workspaceId } }
  })
  - Neu da la member → throw ConflictException('You are already a member of this workspace')

- Transaction:
  await prisma.$transaction(async (tx) => {
    await tx.workspaceMember.create({
      data: { userId, workspaceId: invitation.workspaceId, role: invitation.role }
    });
    await tx.workspaceInvitation.delete({ where: { id: invitation.id } });
  });

- Return { message: 'Joined workspace successfully', workspaceId: invitation.workspaceId }
```

---

## Task 3.2: Them member endpoints vao workspaces.controller.ts

**File:** `apps/api/src/modules/workspaces/workspaces.controller.ts` (tiep tuc modify)

**QUAN TRONG — Thu tu route:**
`POST join/:token` PHAI dat TRUOC `GET :id` de tranh NestJS confuse `join` la `:id`.

**Endpoints:**

```typescript
// === DAT join TRUOC cac :id routes ===
@Post('join/:token')
@ApiOperation({ summary: 'Join workspace via invitation link' })
joinByToken(@Param('token') token: string, @CurrentUser('id') userId: string)

// === :id routes (Phase 2 da co, them tiep) ===

@Get(':id/members')
@UseGuards(WorkspaceRoleGuard)
@ApiOperation({ summary: 'List workspace members' })
getMembers(@Param('id') id: string)

@Post(':id/invite')
@UseGuards(WorkspaceRoleGuard)
@WorkspaceRoles(Role.OWNER, Role.ADMIN)
@ApiOperation({ summary: 'Invite member via email' })
inviteMember(@Param('id') id: string, @Body() dto: InviteMemberDto, @CurrentUser('id') userId: string)

@Delete(':id/members/:userId')
@UseGuards(WorkspaceRoleGuard)
@WorkspaceRoles(Role.OWNER, Role.ADMIN)
@ApiOperation({ summary: 'Remove member from workspace' })
removeMember(@Param('id') id: string, @Param('userId') userId: string)

@Patch(':id/members/:userId')
@UseGuards(WorkspaceRoleGuard)
@WorkspaceRoles(Role.OWNER, Role.ADMIN)
@ApiOperation({ summary: 'Update member role' })
updateMemberRole(@Param('id') id: string, @Param('userId') userId: string, @Body() dto: UpdateMemberRoleDto)
```

---

## Verification

- [ ] `nest build` pass
- [ ] Test voi Postman:
  - GET /api/workspaces/:id/members — list members
  - POST /api/workspaces/:id/invite — gui email (check email thuc te hoac check logs)
  - POST /api/workspaces/:id/invite — email da la member → 409
  - POST /api/workspaces/:id/invite — email da duoc moi → 409
  - POST /api/workspaces/:id/invite — MEMBER goi → 403
  - POST /api/workspaces/join/:token — join thanh cong → 200
  - POST /api/workspaces/join/:token — token sai → 404
  - POST /api/workspaces/join/:token — token het han → 400
  - POST /api/workspaces/join/:token — da la member → 409
  - DELETE /api/workspaces/:id/members/:userId — xoa member thanh cong
  - DELETE /api/workspaces/:id/members/:userId — xoa OWNER → 403
  - PATCH /api/workspaces/:id/members/:userId — doi role thanh cong
  - PATCH /api/workspaces/:id/members/:userId — doi role OWNER → 403
  - PATCH /api/workspaces/:id/members/:userId — set thanh OWNER → 403

---

## Sau khi xong

Cap nhat PROGRESS.md, roi bao user:

```
=== CHECKPOINT: Branch 03 hoan thanh ===
Da lam:
- Phase 1: DTOs + WorkspaceRoleGuard
- Phase 2: Workspace CRUD (5 endpoints)
- Phase 3: Members + Invitation (5 endpoints)

Files changed: [danh sach]
Endpoints: 10 endpoints workspace

Quay lai T1 de review.
```
