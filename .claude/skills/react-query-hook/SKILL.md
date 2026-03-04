---
name: react-query-hook
description: Generate a custom React Query hook for data fetching with proper typing. Use when creating API integration hooks.
---

# Generate React Query Hook

Create a custom hook using TanStack Query for data fetching.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Hook name or API endpoint (e.g., "useTasks", "GET /projects/:id")

## Pre-flight (BAT BUOC)

Truoc khi tao hook, DOC:
1. `apps/web/src/services/api.ts` — confirm Axios instance config
2. Backend controller tuong ung — confirm endpoint URL + response type
3. `.context/research/PITFALLS.md` > React section — TanStack Query cache stale
4. `.context/research/CONVENTIONS.md` > API Response Format

## Instructions

### Step 1: Clarify (Query vs Mutation, parameters)
### Step 2: Read backend code (KHONG SKIP) — confirm endpoint URL + data shape
### Step 3: Create the hook

#### Query (GET):
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const use[Name] = (id: string) => {
  return useQuery({
    queryKey: ['[name]', id],
    queryFn: async () => {
      const { data } = await api.get<[Type]>(`/[endpoint]/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
```

#### Mutation (POST/PATCH/DELETE):
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export const use[Name] = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: [Type]) => {
      const { data } = await api.post('/[endpoint]', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[related]'] });
    },
  });
};
```

## Code Standards

1. **Naming**: `use[Action][Resource]` — `useGetTasks`, `useCreateProject`
2. **Query Keys**: Array `['resource', id, params]`
3. **API client**: LUON dung `@/services/api` — KHONG tao Axios instance moi
4. **Types**: Match backend DTOs — KHONG tu bia type
5. **Response**: Object truc tiep (khong wrapper), list `{ data, total, page, limit }`

## Pitfalls

- `enabled: !!dependency` cho dependent queries
- `invalidateQueries()` sau mutation — tranh stale cache
- Destructure dung: `const { data } = await api.get(...)` — data la response body

## After Completion

Remind user: "Test hook trong component" + "Update PROGRESS.md!"
