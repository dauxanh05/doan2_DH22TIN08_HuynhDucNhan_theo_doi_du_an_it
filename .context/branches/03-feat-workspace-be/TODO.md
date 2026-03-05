# 03-feat-workspace-be - TODO

## Workspace Module
- [ ] Tao `workspaces.module.ts`
- [ ] Tao `workspaces.controller.ts`
- [ ] Tao `workspaces.service.ts`
- [ ] Tao DTOs: create-workspace.dto.ts, update-workspace.dto.ts, invite-member.dto.ts

## Workspace CRUD
- [ ] POST /workspaces - tao workspace + OWNER
- [ ] GET /workspaces - danh sach workspaces cua user
- [ ] GET /workspaces/:id - chi tiet workspace
- [ ] PATCH /workspaces/:id - cap nhat (OWNER, ADMIN)
- [ ] DELETE /workspaces/:id - xoa (OWNER only)

## Members Management
- [ ] GET /workspaces/:id/members - danh sach members
- [ ] POST /workspaces/:id/invite - gui email invitation
- [ ] DELETE /workspaces/:id/members/:userId - xoa member
- [ ] PATCH /workspaces/:id/members/:userId - doi role
- [ ] POST /workspaces/join/:token - join tu invitation link

## Guard & Permissions
- [ ] Tao `workspace-role.guard.ts`
- [ ] Implement phan quyen theo 4 roles
- [ ] Bao ve OWNER khong bi xoa/doi role

## Test manual
- [ ] Test tao workspace
- [ ] Test CRUD workspace
- [ ] Test invite member qua email
- [ ] Test join workspace tu link
- [ ] Test phan quyen (OWNER vs ADMIN vs MEMBER vs VIEWER)
- [ ] Test xoa member
- [ ] Test doi role
