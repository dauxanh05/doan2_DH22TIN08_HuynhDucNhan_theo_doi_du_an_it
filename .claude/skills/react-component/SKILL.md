---
name: react-component
description: Generate a React component with TypeScript, Tailwind CSS, and proper structure. Use when creating frontend components.
---

# Generate React Component

Create a React component following DevTeamOS frontend architecture.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Component name and optional type (e.g., "Button ui", "TaskCard feature", "Sidebar layout")

## Pre-flight (BAT BUOC)

Truoc khi tao component, DOC:
1. `.context/research/CONVENTIONS.md` — naming, import order
2. `.context/research/PITFALLS.md` > React section — cam bay
3. Existing components tuong tu — follow pattern giong het
4. `apps/web/src/services/api.ts` — neu component can fetch data
5. `apps/web/src/stores/` — neu component can global state

## Instructions

When the user runs `/react-component <name> [type]`:

### Step 1: Clarify Requirements
Ask user:
1. "Component này thuộc loại nào?" (ui / layout / feature)
2. "Component này cần những props gì?"

### Step 2: Read existing code (KHONG SKIP)
- DOC existing components cung loai — follow pattern
- DOC stores se dung (neu co) — confirm state shape
- DOC API hooks se dung (neu co) — confirm data type

### Step 3: Create the component
```typescript
import { type FC } from 'react';

interface ComponentNameProps {
  // props
}

export const ComponentName: FC<ComponentNameProps> = ({ prop1 }) => {
  return <div className="...">{/* content */}</div>;
};
```

## File Locations

```
apps/web/src/
├── components/ui/              ← Reusable (Button, Input, Modal...)
├── layouts/                    ← AuthLayout, DashboardLayout
├── features/{name}/components/ ← Feature-specific
```

## Code Standards

1. **TypeScript**: Always define Props interface, no `any`
2. **Styling**: Tailwind CSS, custom utilities: `btn`, `btn-primary`, `input`, `card`
3. **Dark mode**: `dark:` prefix
4. **Path alias**: `@/` = `src/`
5. **Zustand**: LUON dung selector `useStore((s) => s.field)` — KHONG destructure

## Existing Stores

- `auth.store.ts` — user, isAuthenticated, persist
- `theme.store.ts` — dark/light mode
- `workspace.store.ts` — current workspace

## After Completion

Remind user:
- "Test trong browser: http://localhost:5173"
- "Nhớ update PROGRESS.md!"
