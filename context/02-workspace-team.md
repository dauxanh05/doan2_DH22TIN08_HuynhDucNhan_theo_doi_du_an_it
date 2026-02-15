# Phan 2: Workspace & Team

> **Quyet dinh:** Multi-workspace, email invitation, 4 roles

---

## Tong quan

Workspace la don vi to chuc chinh (multi-tenant). Moi workspace co members voi cac role khac nhau.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Multi-workspace | **Co** - 1 user tham gia nhieu workspace |
| Invite flow | **Email invitation** - gui email chua link moi |
| Roles | **4 roles**: OWNER, ADMIN, MEMBER, VIEWER |
| CRUD workspace | Giu nguyen |
| Members management | Giu nguyen (list, remove, change role) |
| Workspace switcher | Giu nguyen (dropdown o header) |

---

## Phan quyen chi tiet

| Hanh dong | OWNER | ADMIN | MEMBER | VIEWER |
|-----------|-------|-------|--------|--------|
| Xoa workspace | x | | | |
| Sua workspace settings | x | x | | |
| Moi member | x | x | | |
| Xoa member | x | x | | |
| Doi role member | x | x | | |
| Tao/sua/xoa project | x | x | x | |
| Tao/sua/xoa task | x | x | x | |
| Xem project/task | x | x | x | x |
| Comment | x | x | x | |

> **Note:** OWNER chi co 1 nguoi duy nhat, khong the chuyen role.

---

## API Endpoints

### Workspaces
```
POST   /workspaces                        # Tao workspace (user tro thanh OWNER)
GET    /workspaces                        # Danh sach workspaces cua user
GET    /workspaces/:id                    # Chi tiet workspace
PATCH  /workspaces/:id                    # Cap nhat workspace (OWNER, ADMIN)
DELETE /workspaces/:id                    # Xoa workspace (OWNER only)
```

### Members
```
GET    /workspaces/:id/members            # Danh sach members
POST   /workspaces/:id/invite             # Moi member qua email (OWNER, ADMIN)
DELETE /workspaces/:id/members/:userId    # Xoa member (OWNER, ADMIN)
PATCH  /workspaces/:id/members/:userId    # Doi role (OWNER, ADMIN)
POST   /workspaces/join/:token            # Join workspace tu invitation link
```

---

## Invitation Flow

```
1. OWNER/ADMIN nhap email nguoi muoi moi
   -> Server tao WorkspaceInvitation (token unique, het han 7 ngay)
   -> Gui email chua link: {FRONTEND_URL}/invite/{token}

2. Nguoi nhan click link
   -> Neu chua co tai khoan: redirect sang /register, sau khi dang ky tu dong join
   -> Neu da co tai khoan: redirect sang /login (neu chua login), sau do tu dong join
   -> Neu da login: join luon

3. Join thanh cong
   -> Tao WorkspaceMember voi role duoc chi dinh khi moi
   -> Xoa invitation
   -> Redirect vao workspace
```

---

## Database (lien quan)

```prisma
model Workspace {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logo        String?
  plan        Plan     @default(FREE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members     WorkspaceMember[]
  projects    Project[]
  invitations WorkspaceInvitation[]
}

model WorkspaceMember {
  id          String   @id @default(cuid())
  userId      String
  workspaceId String
  role        Role     @default(MEMBER)
  joinedAt    DateTime @default(now())

  user        User      @relation(...)
  workspace   Workspace @relation(...)

  @@unique([userId, workspaceId])
}

model WorkspaceInvitation {
  id          String   @id @default(cuid())
  workspaceId String
  email       String
  role        Role     @default(MEMBER)
  token       String   @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  workspace   Workspace @relation(...)

  @@unique([workspaceId, email])
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}
```

---

## Frontend Pages

| Page | Route | Mo ta |
|------|-------|-------|
| Workspace List | `/workspaces` | Danh sach workspace + nut tao moi |
| Workspace Settings | `/workspaces/:id/settings` | Sua ten, logo, xoa workspace |
| Members | `/workspaces/:id/members` | Danh sach, moi, xoa, doi role |
| Join Invitation | `/invite/:token` | Xu ly join tu email link |

### Workspace Switcher
- Dropdown o header
- Hien thi ten + logo workspace hien tai
- Click -> danh sach workspace de chuyen
- Nut "Tao workspace moi" o cuoi dropdown

---

## Files can tao/cap nhat

### Backend
- `src/modules/workspaces/workspaces.module.ts`
- `src/modules/workspaces/workspaces.controller.ts`
- `src/modules/workspaces/workspaces.service.ts`
- `src/modules/workspaces/dto/create-workspace.dto.ts`
- `src/modules/workspaces/dto/update-workspace.dto.ts`
- `src/modules/workspaces/dto/invite-member.dto.ts`
- `src/common/guards/workspace-role.guard.ts`

### Frontend
- `src/features/workspaces/WorkspaceListPage.tsx`
- `src/features/workspaces/WorkspaceSettingsPage.tsx`
- `src/features/workspaces/MembersPage.tsx`
- `src/features/workspaces/JoinInvitationPage.tsx`
- `src/components/WorkspaceSwitcher.tsx`
- `src/stores/workspace.store.ts`

---

*Last updated: 2026-02-15*
