# CONTRACTS — Branch 04-feat-workspace-fe

> T2 PHAI doc file nay TRUOC khi code. Follow CHINH XAC.

---

## Existing Imports (VERIFIED — ko tu bia)

### From React ecosystem
```
react: useState, useEffect, useCallback, type FC
react-router-dom: useNavigate, useParams, useLocation, Link, NavLink, Navigate
react-hook-form: useForm
@hookform/resolvers/zod: zodResolver
zod: z
@tanstack/react-query: useQuery, useMutation, useQueryClient
react-hot-toast: toast
lucide-react: Loader2, Plus, Trash2, UserPlus, Crown, ChevronDown, Settings, Users, Check, X, Building2, Copy, Mail
clsx: clsx
```

### From project (verified paths)

| Import | Path | Note |
|--------|------|------|
| api | `@/services/api` | Axios instance, default export, withCredentials: true |
| useAuthStore | `@/stores/auth.store` | user, isAuthenticated, setAuth, logout |
| useWorkspaceStore | `@/stores/workspace.store` | workspaces, currentWorkspace, setters |
| useThemeStore | `@/stores/theme.store` | dark/light mode |
| ProtectedRoute | `@/components/ProtectedRoute` | Redirect /login neu chua auth |
| PublicRoute | `@/components/PublicRoute` | Redirect / neu da auth |
| DashboardLayout | `@/layouts/DashboardLayout` | Sidebar + Header + Outlet |
| AuthLayout | `@/layouts/AuthLayout` | Public layout |

---

## Existing Store — workspace.store.ts

**File:** `apps/web/src/stores/workspace.store.ts`

```typescript
// DA CO — can expand, ko tao moi
import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}
```

**Can expand:**
- Them `persist` middleware cho `currentWorkspace`
- Them `switchWorkspace(workspaceId)` action
- Them `clearWorkspaces()` action
- Them `plan`, `createdAt`, `updatedAt` vao Workspace interface

---

## API Endpoints (tu branch 03 backend)

| Method | Path | Response |
|--------|------|----------|
| POST | /workspaces | `{ id, name, slug, logo, plan, createdAt, updatedAt }` |
| GET | /workspaces | `[{ id, name, slug, logo, plan, role, createdAt, updatedAt }]` |
| GET | /workspaces/:id | `{ id, name, slug, logo, plan, ..., members: [...] }` |
| PATCH | /workspaces/:id | `{ id, name, slug, logo, plan, createdAt, updatedAt }` |
| DELETE | /workspaces/:id | `{ message: string }` |
| GET | /workspaces/:id/members | `[{ id, userId, workspaceId, role, joinedAt, user: { id, name, email, avatar } }]` |
| POST | /workspaces/:id/invite | `{ message: string }` |
| DELETE | /workspaces/:id/members/:userId | `{ message: string }` |
| PATCH | /workspaces/:id/members/:userId | `{ id, userId, workspaceId, role, joinedAt }` |
| POST | /workspaces/join/:token | `{ message: string, workspaceId: string }` |

---

## Patterns to Follow (tu auth pages/hooks)

### Mutation hook pattern (tu useLogin.ts)
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/api';

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkspaceDto) => {
      const response = await api.post('/workspaces', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Tao workspace thanh cong!');
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Tao workspace that bai';
      toast.error(message);
    },
  });
}
```

### Query hook pattern (tu useCurrentUser.ts)
```typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth.store';

export function useWorkspaces() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await api.get('/workspaces');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```

### Page pattern (tu LoginPage.tsx)
- react-hook-form + zod schema
- useForm + zodResolver
- toast messages
- Loader2 spinner
- Tailwind classes: bg-gray-50 dark:bg-gray-900, etc.

---

## Existing UI Components

### DashboardLayout (apps/web/src/layouts/DashboardLayout.tsx)
```
<div min-h-screen flex>
  <Sidebar />
  <div flex-1 flex flex-col>
    <Header />
    <main p-6> <Outlet /> </main>
  </div>
</div>
```

### Sidebar (apps/web/src/components/Sidebar.tsx)
```
<aside w-64>
  Logo section (h-16)
  Navigation section (flex-1) — Dashboard, Du an, Cai dat
  User section (border-t) — avatar, name, email, logout
</aside>
```
→ Them WorkspaceSwitcher giua Logo va Navigation

### Tailwind utilities da co
- `btn`, `btn-primary`, `input`, `card` (defined in index.css)
- Dark mode: `dark:` prefix

---

## Query Keys Convention

| Resource | Key |
|----------|-----|
| User's workspaces | `['workspaces']` |
| Single workspace | `['workspace', workspaceId]` |
| Workspace members | `['workspaceMembers', workspaceId]` |

**Invalidation rules:**
- After create/update/delete workspace → invalidate `['workspaces']`
- After invite/remove/change-role → invalidate `['workspaceMembers', workspaceId]`
- After join → invalidate `['workspaces']`
