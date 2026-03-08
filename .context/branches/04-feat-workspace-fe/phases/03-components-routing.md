# Phase 3: Components + Routing

> Phase nay tao components va wire up routing.
> Can Phase 2 hoan thanh truoc (pages).

---

## Task 3.1: WorkspaceSwitcher Component

**File:** `apps/web/src/components/WorkspaceSwitcher.tsx`

```typescript
// Truoc khi code: doc apps/web/src/components/Sidebar.tsx de hieu vi tri dat component
```

**UI:**
- Button trigger: hien thi current workspace name + logo (hoac first letter) + ChevronDown icon
- Neu chua chon workspace: "Chon workspace"
- Click button → dropdown menu:
  - List workspaces (tu useWorkspaces hook hoac store)
  - Moi item: logo/initial + name + role badge
  - Click item → switchWorkspace(id) + navigate('/') + close dropdown
  - Divider
  - "Tao workspace moi" button → navigate('/workspaces') hoac open CreateWorkspaceModal
- Dropdown positioning: below button, full width cua sidebar

**State management:**
```
const workspaces = useWorkspaceStore((s) => s.workspaces);
const currentWorkspace = useWorkspaceStore((s) => s.currentWorkspace);
const switchWorkspace = useWorkspaceStore((s) => s.switchWorkspace);
const [isOpen, setIsOpen] = useState(false);
```

**Click outside:** Dung useEffect + ref de close dropdown khi click ngoai.

**Style:** Match sidebar style — bg-white dark:bg-gray-800, border, rounded-lg, shadow cho dropdown.

---

## Task 3.2: CreateWorkspaceModal

**File:** `apps/web/src/features/workspaces/CreateWorkspaceModal.tsx`

**Props:**
```typescript
interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**UI:**
- Modal overlay (fixed inset-0, bg-black/50, z-50)
- Modal content: card center
- Form (react-hook-form + zod):
  - Name input → auto-generate slug
  - Slug input (editable, ma auto-gen tu name)
  - Logo URL input (optional)
- Buttons: "Huy" + "Tao workspace"

**Slug auto-generation:**
```typescript
const watchName = watch('name');
useEffect(() => {
  if (watchName) {
    const slug = watchName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setValue('slug', slug, { shouldValidate: true });
  }
}, [watchName]);
```

**Zod schema:**
```typescript
const createSchema = z.object({
  name: z.string().min(2, 'Ten toi thieu 2 ky tu').max(50, 'Ten toi da 50 ky tu'),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Chi cho phep chu thuong, so va dau gach ngang'),
  logo: z.string().url('URL khong hop le').optional().or(z.literal('')),
});
```

**Logic:**
```
const createWorkspace = useCreateWorkspace();
const setCurrentWorkspace = useWorkspaceStore((s) => s.setCurrentWorkspace);
const navigate = useNavigate();

onSubmit → createWorkspace.mutate(data, {
  onSuccess: (newWorkspace) => {
    setCurrentWorkspace({ ...newWorkspace, role: 'OWNER' });
    onClose();
    navigate('/');
  }
})
```

---

## Task 3.3: InviteMemberModal

**File:** `apps/web/src/features/workspaces/InviteMemberModal.tsx`

**Props:**
```typescript
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}
```

**UI:**
- Modal overlay (giong CreateWorkspaceModal)
- Form:
  - Email input
  - Role dropdown: ADMIN, MEMBER (default), VIEWER — ko co OWNER
- Buttons: "Huy" + "Gui loi moi"

**Zod schema:**
```typescript
const inviteSchema = z.object({
  email: z.string().email('Email khong hop le'),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
});
```

**Logic:**
```
const inviteMember = useInviteMember();

onSubmit → inviteMember.mutate({ workspaceId, data }, {
  onSuccess: () => {
    onClose();
    reset(); // reset form
  }
})
```

---

## Task 3.4: Modify Sidebar.tsx

**File:** `apps/web/src/components/Sidebar.tsx` (MODIFY)

**Thay doi:**
- Import WorkspaceSwitcher
- Them `<WorkspaceSwitcher />` giua Logo section va Navigation section:

```tsx
{/* Logo */}
<div className="h-16 ...">...</div>

{/* === THEM WORKSPACE SWITCHER O DAY === */}
<div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
  <WorkspaceSwitcher />
</div>

{/* Navigation */}
<nav className="flex-1 p-4 space-y-1">...</nav>
```

---

## Task 3.5: Modify App.tsx — Them workspace routes

**File:** `apps/web/src/App.tsx` (MODIFY)

**Thay doi:**

1. Import workspace pages:
```typescript
import WorkspaceListPage from '@/features/workspaces/WorkspaceListPage';
import WorkspaceSettingsPage from '@/features/workspaces/WorkspaceSettingsPage';
import MembersPage from '@/features/workspaces/MembersPage';
import JoinInvitationPage from '@/features/workspaces/JoinInvitationPage';
```

2. Them route `/invite/:token` trong public area (ko can AuthLayout, ko can PublicRoute — accessible moi luc):
```tsx
{/* Join invitation — accessible ca khi chua login */}
<Route path="/invite/:token" element={<JoinInvitationPage />} />
```

3. Them workspace routes trong ProtectedRoute > DashboardLayout:
```tsx
<Route path="/workspaces" element={<WorkspaceListPage />} />
<Route path="/workspaces/:id/settings" element={<WorkspaceSettingsPage />} />
<Route path="/workspaces/:id/members" element={<MembersPage />} />
```

---

## Verification

- [ ] Full build pass (`tsc --noEmit`)
- [ ] Browser test:
  - WorkspaceSwitcher hien thi trong Sidebar
  - Click "Tao workspace moi" → modal → tao → redirect
  - WorkspaceListPage hien thi danh sach
  - Click workspace card → set currentWorkspace + redirect /
  - WorkspaceSwitcher cap nhat current workspace
  - WorkspaceSettingsPage → form edit + save
  - WorkspaceSettingsPage → OWNER thay delete button, non-OWNER ko thay
  - MembersPage → list members + invite modal
  - MembersPage → OWNER/ADMIN doi role, xoa member
  - JoinInvitationPage → auto join khi da auth
  - JoinInvitationPage → redirect login khi chua auth

---

## Sau khi xong

Cap nhat PROGRESS.md, roi bao user:

```
=== CHECKPOINT: Branch 04 hoan thanh ===
Da lam:
- Phase 1: Expand Store + 10 Hooks
- Phase 2: 4 Workspace Pages
- Phase 3: WorkspaceSwitcher + 2 Modals + Routing

Files changed/created: [danh sach]
Pages: WorkspaceListPage, WorkspaceSettingsPage, MembersPage, JoinInvitationPage
Components: WorkspaceSwitcher, CreateWorkspaceModal, InviteMemberModal

Quay lai T1 de review.
```
