---
paths:
  - "apps/web/**/*.ts"
  - "apps/web/**/*.tsx"
---

# Frontend Rules (React + TypeScript)

## Component Structure

- Feature-based: `src/features/{name}/components/`
- Shared UI: `src/components/ui/`
- Layouts: `src/layouts/`
- Path alias: `@/` = `src/`

```typescript
import { type FC } from 'react';

interface ComponentNameProps {
  // props
}

export const ComponentName: FC<ComponentNameProps> = ({ prop1 }) => {
  return <div className="...">{/* content */}</div>;
};
```

## State Management

### Zustand (client state)
- File: `src/stores/{name}.store.ts`
- LUON dung selector de tranh unnecessary re-renders:
  ```typescript
  // GOOD
  const user = useAuthStore((state) => state.user);
  // BAD — re-render khi bat ky state nao thay doi
  const { user } = useAuthStore();
  ```

### TanStack Query (server state)
- Hooks: `src/hooks/use{Name}.ts`
- Query keys: array format `['resource', id, params]`
- Sau mutation: `queryClient.invalidateQueries({ queryKey: ['resource'] })`
- Dung `enabled: !!dependency` cho dependent queries

## API Calls

- Dung `@/services/api` (Axios instance voi interceptor)
- KHONG tao Axios instance moi
- `withCredentials: true` da config san (gui cookies)

## Styling

- TailwindCSS utility classes
- Custom utilities da co: `btn`, `btn-primary`, `input`, `card`
- Dark mode: `dark:` prefix, controlled by `theme.store.ts`
- KHONG viet inline styles — dung Tailwind

## Forms

- React Hook Form + Zod validation
- Uncontrolled components (performance)
- KHONG mix controlled va uncontrolled inputs

## Existing Stores

- `auth.store.ts` — user, isAuthenticated, persist
- `theme.store.ts` — dark/light mode
- `workspace.store.ts` — current workspace

## Existing Layouts

- `AuthLayout` — public pages (login, register)
- `DashboardLayout` — protected pages (sidebar, header)
