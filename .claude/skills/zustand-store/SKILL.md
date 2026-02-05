---
name: zustand-store
description: Generate a Zustand store with TypeScript and persist middleware. Use when creating global state management.
---

# Generate Zustand Store

Create a Zustand store for global state management.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Store name (e.g., "project", "task", "ui")

## Instructions

When the user runs `/zustand-store <name>`:

### Step 1: Clarify Requirements
Ask user:
1. "Store này quản lý state gì?"
2. "Cần persist (lưu localStorage) không?"
3. "Có những actions nào?"

### Step 2: Show Plan
```
📋 Plan for store: use[Name]Store

State:
- [field1]: [type]
- [field2]: [type]

Actions:
- [action1]()
- [action2]()

Persist: [Yes/No]
File: apps/web/src/stores/[name].store.ts
```

### Step 3: Create the store

#### Basic Store:
```typescript
// stores/[name].store.ts
import { create } from 'zustand';

interface [Name]State {
  // State
  field1: string;
  
  // Actions
  setField1: (value: string) => void;
  reset: () => void;
}

const initialState = {
  field1: '',
};

export const use[Name]Store = create<[Name]State>((set) => ({
  ...initialState,
  
  setField1: (value) => set({ field1: value }),
  reset: () => set(initialState),
}));
```

#### With Persist:
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const use[Name]Store = create<[Name]State>()(
  persist(
    (set) => ({
      field1: '',
      setField1: (value) => set({ field1: value }),
    }),
    { name: '[name]-storage' }
  )
);
```

### Step 4: Explain the store
1. **create()** - Tạo store với Zustand
2. **set()** - Cập nhật state
3. **persist()** - Lưu vào localStorage
4. **Selector pattern** - Tối ưu re-render

## Code Standards

1. **Naming**: `use[Name]Store`
2. **File location**: `apps/web/src/stores/[name].store.ts`
3. **Selector usage** (tối ưu performance):
   ```typescript
   // ✅ Good
   const user = useAuthStore((state) => state.user);
   
   // ❌ Bad - re-render khi bất kỳ state nào thay đổi
   const { user, theme } = useAuthStore();
   ```

## Existing Stores Reference

Check `apps/web/src/stores/`:
- `auth.store.ts` - Authentication state
- `theme.store.ts` - Theme/dark mode
- `workspace.store.ts` - Current workspace

## Example Usage

```
/zustand-store project
/zustand-store kanban with persist
/zustand-store ui
```

## After Completion

Remind user:
- "Nhớ dùng selector để tối ưu performance!"
- "Nhớ update PROGRESS.md!"
