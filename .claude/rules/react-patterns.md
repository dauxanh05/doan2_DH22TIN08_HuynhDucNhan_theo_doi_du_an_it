---
paths:
  - "apps/web/**/*.tsx"
  - "apps/web/**/*.ts"
---

# React Deep Patterns

> Tu dong load khi lam viec voi React files. Bo sung cho frontend.md co ban.

## Component Patterns

### Page Component (feature page)
```typescript
// src/features/workspaces/pages/WorkspaceListPage.tsx
import { type FC } from 'react';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { WorkspaceCard } from '../components/WorkspaceCard';

export const WorkspaceListPage: FC = () => {
  const { data, isLoading } = useWorkspaces();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((ws) => <WorkspaceCard key={ws.id} workspace={ws} />)}
    </div>
  );
};
```

### Feature Component (reusable within feature)
```typescript
// src/features/workspaces/components/WorkspaceCard.tsx
interface WorkspaceCardProps {
  workspace: WorkspaceResponse;
}

export const WorkspaceCard: FC<WorkspaceCardProps> = ({ workspace }) => {
  return <div className="card p-4">{workspace.name}</div>;
};
```

## TanStack Query Patterns

### Query Hook
```typescript
// src/hooks/useWorkspaces.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => api.get('/workspaces').then((r) => r.data),
  });
};

// Query co params
export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: () => api.get(`/workspaces/${id}`).then((r) => r.data),
    enabled: !!id,  // chi fetch khi co id
  });
};
```

### Mutation Hook
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) =>
      api.post('/workspaces', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};
```

### Query Key Convention
```typescript
// Pattern: ['resource', id?, filters?]
['workspaces']                          // list all
['workspaces', workspaceId]             // single
['workspaces', workspaceId, 'projects'] // nested resource
['tasks', { status: 'TODO', page: 1 }] // filtered list
```

## Zustand Patterns

### Store voi persist
```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    { name: 'auth-storage' },
  ),
);
```

### Selector pattern (LUON dung)
```typescript
// GOOD — chi re-render khi user thay doi
const user = useAuthStore((s) => s.user);
const isAuth = useAuthStore((s) => !!s.accessToken);

// BAD — re-render khi BAT KY state nao thay doi
const { user } = useAuthStore();
```

## Form Pattern (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Ten bat buoc').max(100),
  email: z.string().email('Email khong hop le'),
});

type FormData = z.infer<typeof schema>;

export const MyForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => { /* mutation.mutate(data) */ };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} className="input" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
    </form>
  );
};
```

## Error Handling Pattern

```typescript
// Axios interceptor da handle 401 → refresh token
// Component chi can handle specific cases:
const mutation = useCreateWorkspace();

const onSubmit = (data: FormData) => {
  mutation.mutate(data, {
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.error('Workspace name da ton tai');
      }
      // Other errors → Axios interceptor handles (toast generic error)
    },
  });
};
```

## Protected Route Pattern

```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const isAuth = useAuthStore((s) => !!s.accessToken);
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
```
