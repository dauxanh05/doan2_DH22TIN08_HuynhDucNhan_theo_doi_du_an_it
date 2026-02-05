---
name: react-component
description: Generate a React component with TypeScript, Tailwind CSS, and proper structure. Use when creating frontend components.
---

# Generate React Component

Create a React component following DevTeamOS frontend architecture.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Component name and optional type (e.g., "Button", "TaskCard ui", "ProjectList feature")

## Instructions

When the user runs `/react-component <name> [type]`:

### Step 1: Clarify Requirements
Ask user:
1. "Component này thuộc loại nào?"
   - `ui` - Reusable UI component (`apps/web/src/components/ui/`)
   - `layout` - Layout component (`apps/web/src/layouts/`)
   - `feature` - Feature-specific (`apps/web/src/features/<feature>/components/`)

2. "Component này cần những props gì?" (if not obvious)

### Step 2: Determine file location
Based on type:
```
apps/web/src/
├── components/ui/       ← ui components
├── layouts/             ← layout components
├── features/
│   ├── auth/components/ ← auth feature
│   ├── kanban/components/ ← kanban feature
│   ├── projects/components/ ← projects feature
│   └── tasks/components/ ← tasks feature
```

### Step 3: Create the component
```typescript
import { type FC } from 'react';

interface ComponentNameProps {
  // props here
}

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  return (
    <div className="...">
      {/* content */}
    </div>
  );
};
```

### Step 4: Explain after creation
For each file:
1. Explain the structure and WHY
2. Explain the TypeScript types used
3. Explain Tailwind classes if complex
4. Ask: "Bạn hiểu phần này chưa?"

## Code Standards

1. **TypeScript**:
   - Always define Props interface
   - Use proper types (no `any`)

2. **Styling**:
   - Use Tailwind CSS classes
   - Use project utilities: `btn`, `btn-primary`, `input`, `card`
   - Dark mode support via `dark:` prefix

3. **Path alias**: Use `@/` for imports
   ```typescript
   import { Button } from '@/components/ui/Button';
   ```

## Existing Components Reference

Check existing patterns in:
- `apps/web/src/components/` - UI components
- `apps/web/src/features/` - Feature components
- `apps/web/src/layouts/` - AuthLayout, DashboardLayout

## Example Usage

```
/react-component Button ui
/react-component TaskCard feature
/react-component Sidebar layout
```

## After Completion

Remind user:
- "Nhớ update PROGRESS.md!"
- "Test component trong browser"
