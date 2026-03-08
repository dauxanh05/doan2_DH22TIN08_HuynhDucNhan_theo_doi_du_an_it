# Phase 2: Pages (4 workspace pages)

> Phase nay tao 4 pages cho workspace management.
> Can Phase 1 hoan thanh truoc (store + hooks).

---

## Task 2.1: WorkspaceListPage

**File:** `apps/web/src/features/workspaces/WorkspaceListPage.tsx`

```typescript
// Truoc khi code: doc apps/web/src/features/auth/LoginPage.tsx de follow page pattern
```

**Route:** `/workspaces`

**UI:**
- Header: "Workspaces" + "Tao workspace moi" button (Plus icon)
- Grid layout: 3 columns responsive (1 col mobile, 2 tablet, 3 desktop)
- Workspace card:
  - Logo (hoac first letter avatar)
  - Name + slug
  - Role badge (color-coded: OWNER=indigo, ADMIN=blue, MEMBER=green, VIEWER=gray)
  - Member count (neu co tu API)
  - Click → `setCurrentWorkspace(ws)` + navigate to `/`
- Loading state: 6 skeleton cards
- Empty state: illustration text + "Tao workspace dau tien cua ban" button

**Logic:**
```
const { data: workspaces, isLoading } = useWorkspaces();
const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);
const navigate = useNavigate();
const [showCreate, setShowCreate] = useState(false);

// Click workspace card
const handleSelect = (ws) => {
  setCurrentWorkspace(ws);
  navigate('/');
};
```

---

## Task 2.2: WorkspaceSettingsPage

**File:** `apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx`

**Route:** `/workspaces/:id/settings`

**UI:**
- Breadcrumb: Workspaces > [name] > Cai dat
- Form (react-hook-form + zod):
  - Name: text input
  - Slug: text input (disabled suggestion: auto-gen from name)
  - Logo: text input (URL)
- Save button
- Danger zone (chi hien cho OWNER):
  - "Xoa workspace" button (red) → confirmation dialog

**Zod schema:**
```typescript
const settingsSchema = z.object({
  name: z.string().min(2, 'Ten toi thieu 2 ky tu').max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Chi cho phep chu thuong, so va dau gach ngang'),
  logo: z.string().url('URL khong hop le').optional().or(z.literal('')),
});
```

**Logic:**
```
const { id } = useParams();
const { data: workspace, isLoading } = useWorkspace(id);
const updateWorkspace = useUpdateWorkspace();
const deleteWorkspace = useDeleteWorkspace();
const navigate = useNavigate();
const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);

// Check role from workspace members or currentWorkspace
const isOwner = currentWorkspace?.role === 'OWNER';
```

---

## Task 2.3: MembersPage

**File:** `apps/web/src/features/workspaces/MembersPage.tsx`

**Route:** `/workspaces/:id/members`

**UI:**
- Header: "Thanh vien" + "Moi thanh vien" button (UserPlus icon) — chi cho OWNER/ADMIN
- Members table:
  - Avatar (first letter) + Name + Email
  - Role badge (dropdown de doi role cho OWNER/ADMIN)
  - Joined date
  - Actions: Remove button (chi cho OWNER/ADMIN, ko cho xoa OWNER)
- OWNER row: Crown icon, ko co action buttons

**Logic:**
```
const { id } = useParams();
const { data: members, isLoading } = useWorkspaceMembers(id);
const removeMember = useRemoveMember();
const updateRole = useUpdateMemberRole();
const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);

const canManage = currentWorkspace?.role === 'OWNER' || currentWorkspace?.role === 'ADMIN';
```

**Role dropdown:** Khi OWNER/ADMIN click role badge → dropdown chon ADMIN/MEMBER/VIEWER → call updateRole mutation.

---

## Task 2.4: JoinInvitationPage

**File:** `apps/web/src/features/workspaces/JoinInvitationPage.tsx`

**Route:** `/invite/:token`

**Logic 3 cases:**

1. **Da auth** → Auto call joinByToken mutation:
   ```
   const { token } = useParams();
   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
   const joinWorkspace = useJoinWorkspace();

   useEffect(() => {
     if (isAuthenticated && token) {
       joinWorkspace.mutate(token);
     }
   }, [isAuthenticated, token]);
   ```

2. **Chua auth** → Hien thi:
   - "Ban can dang nhap de tham gia workspace"
   - Login button → navigate(`/login`, { state: { from: `/invite/${token}` } })
   - Register button → navigate(`/register`, { state: { from: `/invite/${token}` } })

3. **Error** → Hien thi:
   - Token het han: "Loi moi da het han"
   - Token sai: "Loi moi khong hop le"
   - Link ve trang chu

**UI:**
- Center layout (giong verify email page)
- Card voi icon + message + action buttons
- Loading state khi dang join

---

## Verification

- [ ] Tat ca pages compile
- [ ] Pages render khong loi trong browser
- [ ] Form validation hoat dong (workspace settings)

---

## Sau khi xong

Cap nhat PROGRESS.md, roi bao user: "Phase 2 xong. Tiep tuc Phase 3?"
