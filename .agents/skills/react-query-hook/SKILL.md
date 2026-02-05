---
name: react-query-hook
description: Generate a custom React Query hook for data fetching with proper typing. Use when creating API integration hooks.
---

# Generate React Query Hook

Create a custom hook using TanStack Query for data fetching.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Hook name or API endpoint (e.g., "useTasks", "GET /projects/:id")

## Instructions

When the user runs `/react-query-hook <name>`:

### Step 1: Clarify Requirements
Ask user:
1. "Hook này fetch data gì?" (tasks, projects, workspaces...)
2. "Query hay Mutation?"
   - Query = GET (đọc data)
   - Mutation = POST/PATCH/DELETE (thay đổi data)
3. "Cần parameters gì?" (id, filters, pagination...)

### Step 2: Show Plan
```
📋 Plan for hook: use[Name]

Type: [Query/Mutation]
Endpoint: [METHOD] /api/[path]
Parameters: [list params]

File: apps/web/src/hooks/use[Name].ts
```

### Step 3: Create the hook

#### For Query (GET):
```typescript
// hooks/use[Name].ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

interface [Name]Response {
  // response type
}

export const use[Name] = (id: string) => {
  return useQuery({
    queryKey: ['[name]', id],
    queryFn: async () => {
      const { data } = await api.get<[Name]Response>(`/[endpoint]/${id}`);
      return data;
    },
  });
};
```

#### For Mutation (POST/PATCH/DELETE):
```typescript
// hooks/use[Name].ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

interface [Name]Input {
  // input type
}

export const use[Name] = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: [Name]Input) => {
      const { data } = await api.post('/[endpoint]', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[related]'] });
    },
  });
};
```

### Step 4: Explain the hook
1. **queryKey** - Unique key cho caching
2. **queryFn** - Function thực hiện fetch
3. **invalidateQueries** - Refresh data sau mutation

## Code Standards

1. **Naming**: `use[Action][Resource]`
   - `useGetTasks`, `useCreateProject`, `useUpdateTask`

2. **Query Keys**: Array format
   ```typescript
   queryKey: ['tasks', projectId]
   queryKey: ['projects', { page, limit }]
   ```

3. **API client**: Use `@/services/api`
   ```typescript
   import { api } from '@/services/api';
   ```

## Common Patterns

### Pagination
```typescript
useQuery({
  queryKey: ['tasks', page, limit],
  queryFn: () => api.get(`/tasks?page=${page}&limit=${limit}`),
});
```

### Dependent Queries
```typescript
useQuery({
  queryKey: ['tasks', projectId],
  queryFn: () => api.get(`/projects/${projectId}/tasks`),
  enabled: !!projectId,
});
```

## Example Usage

```
/react-query-hook useGetTasks
/react-query-hook useCreateTask mutation
/react-query-hook GET /projects/:id
```

## After Completion

Remind user:
- "Test hook trong component"
- "Nhớ update PROGRESS.md!"
