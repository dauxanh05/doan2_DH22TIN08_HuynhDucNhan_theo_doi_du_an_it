---
name: zustand-store
description: Generate a Zustand store with TypeScript and persist middleware. Use when creating global state management.
---

# Generate Zustand Store

Create a Zustand store for global state management.

> **Important:** Follow the Learning Mode guidelines in `_templates/learning-mode.md`

## Arguments
- `$ARGUMENTS` - Store name (e.g., "project", "task", "ui")

## Pre-flight (BAT BUOC)

Truoc khi tao store, DOC:
1. `apps/web/src/stores/` — xem stores da co, follow pattern
2. `apps/web/src/stores/auth.store.ts` — reference persist pattern
3. `.context/research/PITFALLS.md` > React — Zustand persist hydration

## Instructions

### Step 1: Read existing stores (KHONG SKIP)
### Step 2: Clarify (state, actions, persist yes/no)
### Step 3: Create the store

#### Basic:
```typescript
import { create } from 'zustand';

interface [Name]State {
  field1: string;
  setField1: (value: string) => void;
  reset: () => void;
}

const initialState = { field1: '' };

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
    (set) => ({ /* state + actions */ }),
    { name: '[name]-storage' }
  )
);
```

## Code Standards

1. **Naming**: `use[Name]Store`, file `[name].store.ts` in `src/stores/`
2. **Selector** (BAT BUOC): `useStore((s) => s.field)` — KHONG destructure
3. **Reset**: Tach `initialState` object

## Existing Stores (KHONG tao trung lap)

- `auth.store.ts` — user, isAuthenticated, persist
- `theme.store.ts` — dark/light mode
- `workspace.store.ts` — current workspace

## Pitfalls

- Persist hydration flash → check `hasHydrated`
- LUON dung selector — tranh unnecessary re-renders

## After Completion

Remind user: "Dùng selector!" + "Update PROGRESS.md!"
