# Phase 1: Expand Store + Create Hooks

> Phase nay tao data layer cho workspace frontend.

---

## Task 1.1: Expand workspace.store.ts

**File:** `apps/web/src/stores/workspace.store.ts` (MODIFY — ko tao moi)

```typescript
// Truoc khi code: doc apps/web/src/stores/auth.store.ts de hieu persist pattern
```

**Thay doi:**

1. Them `persist` middleware (chi persist `currentWorkspace`)
2. Mo rong Workspace interface: them `plan`, `createdAt`, `updatedAt`
3. Them actions: `switchWorkspace`, `clearWorkspaces`

**Interface moi:**
```typescript
interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL';
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  switchWorkspace: (workspaceId: string) => void;
  clearWorkspaces: () => void;
}
```

**Persist config:**
```typescript
import { persist } from 'zustand/middleware';

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      currentWorkspace: null,
      setWorkspaces: (workspaces) => set({ workspaces }),
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      switchWorkspace: (workspaceId) => {
        const ws = get().workspaces.find((w) => w.id === workspaceId);
        if (ws) set({ currentWorkspace: ws });
      },
      clearWorkspaces: () => set({ workspaces: [], currentWorkspace: null }),
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({ currentWorkspace: state.currentWorkspace }),
    }
  )
);
```

---

## Task 1.2: Tao Hooks (10 hooks)

**Folder:** `apps/web/src/hooks/` (cung folder voi auth hooks)

```typescript
// Truoc khi code: doc useLogin.ts (mutation) va useCurrentUser.ts (query) de follow pattern
```

### Query Hooks

**useWorkspaces.ts** — GET /workspaces
```
- queryKey: ['workspaces']
- enabled: isAuthenticated
- staleTime: 2 minutes
- onSuccess: setWorkspaces in store
```

**useWorkspace.ts** — GET /workspaces/:id
```
- queryKey: ['workspace', workspaceId]
- enabled: !!workspaceId
- staleTime: 2 minutes
```

**useWorkspaceMembers.ts** — GET /workspaces/:id/members
```
- queryKey: ['workspaceMembers', workspaceId]
- enabled: !!workspaceId
- staleTime: 1 minute
```

### Mutation Hooks

**useCreateWorkspace.ts** — POST /workspaces
```
- onSuccess: invalidate ['workspaces'], toast success
- onError: toast error message
```

**useUpdateWorkspace.ts** — PATCH /workspaces/:id
```
- mutationFn nhan { workspaceId, data }
- onSuccess: invalidate ['workspaces'] + ['workspace', workspaceId], toast success
```

**useDeleteWorkspace.ts** — DELETE /workspaces/:id
```
- mutationFn nhan workspaceId
- onSuccess: invalidate ['workspaces'], clear currentWorkspace neu can, toast success
```

**useInviteMember.ts** — POST /workspaces/:id/invite
```
- mutationFn nhan { workspaceId, data: { email, role } }
- onSuccess: invalidate ['workspaceMembers', workspaceId], toast success
```

**useRemoveMember.ts** — DELETE /workspaces/:id/members/:userId
```
- mutationFn nhan { workspaceId, userId }
- onSuccess: invalidate ['workspaceMembers', workspaceId], toast success
```

**useUpdateMemberRole.ts** — PATCH /workspaces/:id/members/:userId
```
- mutationFn nhan { workspaceId, userId, data: { role } }
- onSuccess: invalidate ['workspaceMembers', workspaceId], toast success
```

**useJoinWorkspace.ts** — POST /workspaces/join/:token
```
- mutationFn nhan token
- onSuccess: invalidate ['workspaces'], toast success, navigate to /
```

---

## Verification

- [ ] `tsc --noEmit` pass
- [ ] Tat ca hooks import dung
- [ ] Store persist hoat dong (check localStorage)

---

## Sau khi xong

Cap nhat PROGRESS.md, roi bao user: "Phase 1 xong. Tiep tuc Phase 2?"
