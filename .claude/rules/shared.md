---
paths:
  - "packages/shared/**/*.ts"
---

# Shared Package Rules

## Purpose

Package `packages/shared/` chua types va constants dung chung giua `apps/api` va `apps/web`.

## Structure

```
packages/shared/src/
├── index.ts          # Re-exports
└── types.ts          # Shared TypeScript types
```

## Rules

- CHI chua types, interfaces, enums, constants
- KHONG chua business logic, utility functions, hay runtime code
- KHONG import tu `apps/api` hay `apps/web` (shared la dependency, khong phu thuoc nguoc)
- Moi type/interface PHAI export tu `index.ts`
- Naming: PascalCase cho types/interfaces, UPPER_SNAKE_CASE cho constants

## Export Pattern

```typescript
// index.ts
export type { UserResponse, TaskResponse } from './types';
export { TaskStatus, Priority } from './types';
```

## Import Pattern (tu apps)

```typescript
// Trong apps/api hoac apps/web
import type { UserResponse } from '@devteamos/shared';
```
