# 04-feat-workspace-fe - Context

> **Loai:** feat | **Phu thuoc:** 03-feat-workspace-be

## Reference
- `context/02-workspace-team.md` - Frontend pages, Workspace Switcher
- `context/overview.md` - Frontend tech stack

## Scope

Toan bo frontend cho workspace management.

### Pages
- **WorkspaceListPage** (`/workspaces`) - Danh sach workspace + nut tao moi
- **WorkspaceSettingsPage** (`/workspaces/:id/settings`) - Sua ten, logo, xoa workspace
- **MembersPage** (`/workspaces/:id/members`) - Danh sach, moi, xoa, doi role
- **JoinInvitationPage** (`/invite/:token`) - Xu ly join tu email link

### Components
- **WorkspaceSwitcher** - Dropdown o header
  - Hien thi ten + logo workspace hien tai
  - Click -> danh sach workspace de chuyen
  - Nut "Tao workspace moi" o cuoi dropdown

### State
- `workspace.store.ts` - Zustand store: current workspace, switch workspace

## Rules
- Khi user login lan dau, redirect ve /workspaces de chon hoac tao
- WorkspaceSwitcher luon hien thi o header khi da auth
- Join invitation: xu ly ca 3 case (chua co tai khoan, co tai khoan chua login, da login)
