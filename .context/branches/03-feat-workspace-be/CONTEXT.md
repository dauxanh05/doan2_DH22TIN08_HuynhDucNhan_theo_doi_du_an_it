# 03-feat-workspace-be - Context

> **Loai:** feat | **Phu thuoc:** 02-feat-auth-fe

## Reference
- `context/02-workspace-team.md` - Chi tiet Workspace & Team specs
- `context/overview.md` - Database schema, tech stack

## Scope

Toan bo backend cho workspace management va team members.

### Workspace Module (`src/modules/workspaces/`)

#### Workspace CRUD
- **POST /workspaces** - Tao workspace (user tro thanh OWNER)
- **GET /workspaces** - Danh sach workspaces cua user
- **GET /workspaces/:id** - Chi tiet workspace
- **PATCH /workspaces/:id** - Cap nhat workspace (OWNER, ADMIN)
- **DELETE /workspaces/:id** - Xoa workspace (OWNER only)

#### Members
- **GET /workspaces/:id/members** - Danh sach members
- **POST /workspaces/:id/invite** - Moi member qua email (OWNER, ADMIN)
- **DELETE /workspaces/:id/members/:userId** - Xoa member (OWNER, ADMIN)
- **PATCH /workspaces/:id/members/:userId** - Doi role (OWNER, ADMIN)
- **POST /workspaces/join/:token** - Join workspace tu invitation link

### Phan quyen (4 roles)
| Hanh dong | OWNER | ADMIN | MEMBER | VIEWER |
|-----------|-------|-------|--------|--------|
| Xoa workspace | x | | | |
| Sua workspace settings | x | x | | |
| Moi/xoa member, doi role | x | x | | |
| Tao/sua/xoa project/task | x | x | x | |
| Xem project/task | x | x | x | x |
| Comment | x | x | x | |

> OWNER chi co 1 nguoi duy nhat, khong the chuyen role.

### Guard
- `workspace-role.guard.ts` - Kiem tra role cua user trong workspace

### Invitation Flow
1. OWNER/ADMIN nhap email -> tao WorkspaceInvitation (token, het han 7 ngay)
2. Gui email chua link: `{FRONTEND_URL}/invite/{token}`
3. Nguoi nhan click link -> join workspace (tu dong tao WorkspaceMember)

### DTOs
- `create-workspace.dto.ts`, `update-workspace.dto.ts`, `invite-member.dto.ts`

## Rules
- Slug workspace phai unique
- Khi tao workspace, user tu dong thanh OWNER
- Invitation token het han sau 7 ngay
- Gui email invitation qua Nodemailer
- OWNER khong the bi xoa hoac doi role
