# Tab Fix Workspace UX Bugs — Round 3

## Vai tro
Ban la tab worker fix 4 nhom bug workspace UX.
Muc tieu: sau khi xong, user co the test tron ven Phase 2 workspace khong gap cac loi nay nua.

## Rules BAT BUOC
1. Doc code thuc te TRUOC khi sua — khong tu bia imports/paths/functions
2. Giu dung patterns hien tai: React + TanStack Query + Zustand + feature-based
3. KHONG commit. Bao lai T1 tab khi xong
4. Sau khi xong chay:
   - `cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter api exec tsc --noEmit`
   - `cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit`

---

## Doc truoc khi code
1. `.context/STATE.md`
2. `.context/research/CONVENTIONS.md`
3. `.context/research/PITFALLS.md`
4. `apps/web/src/components/LogoPicker.tsx`
5. `apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx`
6. `apps/web/src/hooks/useUploadWorkspaceLogo.ts`
7. `apps/web/src/hooks/useUpdateWorkspace.ts`
8. `apps/web/src/hooks/useJoinWorkspace.ts`
9. `apps/web/src/features/workspaces/JoinInvitationPage.tsx`
10. `apps/web/src/features/workspaces/MembersPage.tsx`
11. `apps/web/src/hooks/useRemoveMember.ts`
12. `apps/web/src/stores/workspace.store.ts`

---

## Bug 1 — Logo preset click khong doi anh ngay

### Root cause
- LogoPicker.tsx click preset goi useUpdateWorkspace.mutate() ngay
- Success invalidate ['workspace', id] -> refetch
- Nhung UI khong co local preview/selected state
- WorkspaceSettingsPage.tsx effect sync currentWorkspace store chi chay khi currentWorkspace?.id !== workspace.id
- Nen neu cung workspace thi logo/name/slug KHONG sync lai store

### Fix can lam
**File: apps/web/src/components/LogoPicker.tsx**
- Them local state `displayLogo` de hien anh ngay khi chon preset hoac upload thanh cong
- Highlight preset dang active (border/ring khi match currentLogo hoac displayLogo)
- Khi prop `currentLogo` thay doi (tu refetch) thi sync lai displayLogo

**File: apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx**
- Sua effect sync currentWorkspace store:
  - Bo dieu kien `currentWorkspace?.id !== workspace.id`
  - Thay bang compare day du: neu name/slug/logo khac nhau thi sync lai store
  - Vi du:
    ```ts
    useEffect(() => {
      if (workspace && currentWorkspace?.id === workspace.id) {
        const needsSync =
          currentWorkspace.name !== workspace.name ||
          currentWorkspace.slug !== workspace.slug ||
          currentWorkspace.logo !== workspace.logo;
        if (needsSync) {
          setCurrentWorkspace({
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            logo: workspace.logo,
            plan: workspace.plan || currentWorkspace.plan,
            role: currentWorkspace.role,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
          });
        }
      } else if (workspace && (!currentWorkspace || currentWorkspace.id !== workspace.id)) {
        // First load or different workspace
        // ... set current workspace
      }
    }, [workspace, currentWorkspace, setCurrentWorkspace]);
    ```

### Acceptance
- Click preset -> anh doi ngay trong LogoPicker
- Sidebar/switcher cung hien logo moi sau refetch

---

## Bug 2 — Upload logo PNG khong hien anh

### Root cause
- Upload endpoint tra { logo: "/uploads/workspace-logos/xxx.png" }
- LogoPicker sau upload success khong cap nhat displayLogo local
- Phu thuoc hoan toan vao refetch query
- currentWorkspace store khong duoc sync logo moi

### Fix can lam
**File: apps/web/src/components/LogoPicker.tsx**
- Sau upload success: set displayLogo tu preview URL hoac response data
- Clear crop state (selectedFile, previewUrl)
- Co the dung callback/onSuccess prop hoac handle ngay trong component

**File: apps/web/src/hooks/useUploadWorkspaceLogo.ts**
- Sau success: doc currentWorkspace tu store, neu dang upload cho workspace hien tai thi update logo trong store
- Vi du:
  ```ts
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });

    // Sync store
    const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore.getState();
    if (currentWorkspace?.id === variables.workspaceId && data.logo) {
      setCurrentWorkspace({ ...currentWorkspace, logo: data.logo });
    }

    toast.success('Cap nhat logo thanh cong!');
  },
  ```

**File: apps/web/src/hooks/useUpdateWorkspace.ts**
- Tuong tu: sau success, sync currentWorkspace store neu update workspace hien tai
- Vi du:
  ```ts
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });

    // Sync store
    const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore.getState();
    if (currentWorkspace?.id === variables.workspaceId && data) {
      setCurrentWorkspace({
        ...currentWorkspace,
        name: data.name ?? currentWorkspace.name,
        slug: data.slug ?? currentWorkspace.slug,
        logo: data.logo ?? currentWorkspace.logo,
      });
    }

    toast.success('Cap nhat workspace thanh cong!');
  },
  ```

### Acceptance
- Upload PNG -> crop -> luu -> anh hien dung ngay
- Sidebar/switcher cung doi logo

---

## Bug 3 — Join workspace khong hien workspace moi

### Root cause
- useJoinWorkspace.ts invalidate ['workspaces'] nhung:
  - Khong dung workspaceId tu API response
  - Khong set currentWorkspace cho workspace vua join
  - Navigate ve '/' — user khong biet workspace moi o dau

### Fix can lam
**File: apps/web/src/hooks/useJoinWorkspace.ts**
- Dung workspaceId tu response
- Navigate toi '/workspaces' thay vi '/'
- Sau invalidate ['workspaces']: su dung onSettled hoac await invalidate roi tim workspace moi trong store
- Vi du:
  ```ts
  onSuccess: async (data) => {
    await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    toast.success('Tham gia workspace thanh cong!');
    navigate('/workspaces', { replace: true });
  },
  ```
- Khong can set currentWorkspace ngay vi user se thay workspace moi trong list va tu chon

### Acceptance
- Join xong -> ve /workspaces -> workspace moi hien trong danh sach ngay
- Khong bi trang trang hay quay ve dashboard rong

---

## Bug 4 — Members page logic chua dung

### Van de hien tai
- ADMIN co the tu xoa chinh minh (nut remove hien cho tat ca non-OWNER)
- Sau remove member, ['workspaces'] va currentWorkspace store khong duoc cap nhat
- Khong co confirm truoc khi remove

### Business rules DUNG phai la
- **OWNER**: khong bi ai xoa/doi role, khong tu xoa duoc
- **ADMIN**: co the xoa MEMBER/VIEWER, doi role MEMBER/VIEWER; KHONG the xoa/doi role ADMIN khac; CO THE tu roi workspace (nut "Roi workspace" rieng)
- **MEMBER/VIEWER**: chi xem, co nut "Roi workspace" cho chinh minh

### Fix can lam
**File: apps/web/src/features/workspaces/MembersPage.tsx**
1. An nut remove cho chinh minh trong danh sach members (khong cho self-remove qua nut xoa member)
2. ADMIN khong thay nut remove/doi role cho ADMIN khac
3. Them nut "Roi workspace" rieng o duoi bang hoac vi tri phu hop:
   - Hien cho tat ca roles TRU OWNER
   - Khi click hien confirm dialog: "Ban co chac chan muon roi workspace nay?"
   - Xac nhan -> goi remove member API voi userId la chinh minh
4. Them confirm dialog truoc khi remove member khac:
   - "Ban co chac chan muon xoa [ten thanh vien] khoi workspace?"

**File: apps/web/src/hooks/useRemoveMember.ts**
- Them invalidate ['workspaces'] va ['workspace', workspaceId]
- Neu self-remove (userId === current user id):
  - Clear currentWorkspace store
  - Navigate '/workspaces'
- Vi du:
  ```ts
  onSuccess: (_data, variables) => {
    queryClient.invalidateQueries({ queryKey: ['workspaceMembers', variables.workspaceId] });
    queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] });

    // Check self-remove
    const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore.getState();
    const currentUserId = useAuthStore.getState().user?.id;

    if (variables.userId === currentUserId) {
      if (currentWorkspace?.id === variables.workspaceId) {
        setCurrentWorkspace(null);
      }
      toast.success('Da roi workspace');
      // Navigate se duoc handle tu component
    } else {
      toast.success('Xoa thanh vien thanh cong!');
    }
  },
  ```
- Luu y: navigate co the can handle trong component thay vi hook (vi useNavigate can goi trong React component)

### Acceptance
- ADMIN khong thay nut xoa cho chinh minh trong members list
- ADMIN khong thay nut xoa/doi role cho ADMIN khac
- Tat ca roles (tru OWNER) thay nut "Roi workspace"
- Bam roi -> confirm -> thanh cong -> ve /workspaces
- OWNER/ADMIN xoa MEMBER -> confirm -> thanh cong

---

## Files can sua (tong hop)

| File | Thay doi |
|------|----------|
| apps/web/src/components/LogoPicker.tsx | Local displayLogo state, highlight active preset, sync khi prop thay doi |
| apps/web/src/features/workspaces/WorkspaceSettingsPage.tsx | Fix effect sync store day du (name/slug/logo) |
| apps/web/src/hooks/useUploadWorkspaceLogo.ts | Sync currentWorkspace store sau success |
| apps/web/src/hooks/useUpdateWorkspace.ts | Sync currentWorkspace store sau success |
| apps/web/src/hooks/useJoinWorkspace.ts | Navigate /workspaces thay vi /, await invalidate |
| apps/web/src/features/workspaces/MembersPage.tsx | An self-remove, them "Roi workspace", ADMIN role rules, confirm dialog |
| apps/web/src/hooks/useRemoveMember.ts | Invalidate them queries, xu ly self-remove |

---

## Verify bat buoc
```bash
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter api exec tsc --noEmit
cd /home/minhnhut_dev/projects/PROGRESS_MANAGEMENT_SYSTEM && pnpm --filter web exec tsc --noEmit
```

---

## Bao lai T1 theo format
1. Root cause tung bug
2. Files changed
3. Cach fix logo (preset + upload)
4. Cach fix join workspace
5. Cach fix members page (role rules + roi workspace)
6. tsc result
7. Chua commit
