# 09-feat-kanban-fe - Context

> **Loai:** feat | **Phu thuoc:** 08-feat-ai-fe

## Reference
- `context/04-kanban.md` - Chi tiet Kanban Board specs
- `context/overview.md` - Frontend tech stack

## Scope

Kanban Board frontend + reorder API nho (BE). Day la nhanh FE-only chinh, gom luon phan reorder API vi no nho.

### Kanban Layout
```
+------------------------------------------------------------------+
| [Filter: Assignee v] [Priority v] [Search: ________]            |
|------------------------------------------------------------------|
| TODO (5)          | IN_PROGRESS (3)   | DONE (8)                 |
|-------------------|-------------------|--------------------------+
| +--Card--------+  | +--Card--------+  | +--Card--------+        |
| | Task title   |  | | Task title   |  | | Task title   |        |
| | [URGENT] red |  | | [HIGH] orange|  | | [LOW] gray   |        |
| | Av Av  D 2/20|  | | Av    D 2/18 |  | | Av Av  D 2/15|        |
| +--------------+  | +--------------+  | +--------------+        |
|                   |                   |                          |
| [+ Them task]     | [+ Them task]     | [+ Them task]            |
+------------------------------------------------------------------+
```

### Components
- **KanbanBoard.tsx** - Container chinh, setup DndContext (@dnd-kit)
- **KanbanColumn.tsx** - 1 cot (TODO/IN_PROGRESS/DONE)
- **TaskCard.tsx** - 1 card task (draggable)
- **KanbanFilterBar.tsx** - Filter assignee + priority + search
- **QuickAddTask.tsx** - Input inline them task nhanh

### Drag & Drop (@dnd-kit)
- `@dnd-kit/core` - Core drag-drop
- `@dnd-kit/sortable` - Sortable trong column
- `@dnd-kit/utilities` - CSS transform helpers

### Hanh vi drag-drop
1. **Cross-column**: keo task tu TODO sang IN_PROGRESS = cap nhat status
   - API: `PATCH /tasks/:id { status: "IN_PROGRESS" }`
2. **Same-column reorder**: doi vi tri = cap nhat position
   - API: `PATCH /tasks/reorder { tasks: [{ id, position }] }`

### Task Card Info
| Element | Visual |
|---------|--------|
| Title | Max 2 dong, ellipsis |
| Priority badge | URGENT=red, HIGH=orange, MEDIUM=blue, LOW=gray |
| Assignee avatars | Circle, xep chong, max 3 + "+N" |
| Due date | Icon + date, do neu overdue |

### Filter (client-side)
- Assignee: dropdown multi-select
- Priority: dropdown multi-select
- Search: text input, debounce 300ms, case-insensitive
- Logic: AND (assignee AND priority AND search)

### Quick Add
- Nut "+ Them task" o cuoi moi cot
- Click -> input inline -> Enter = tao task -> Escape = huy

## Rules
- 3 cot co dinh: TODO, IN_PROGRESS, DONE (khong custom)
- Filter ap dung phia frontend (client-side)
- Smooth animation khi drag-drop
- Click card -> mo Task Detail Modal (da tao o nhanh 06)
- Priority colors: URGENT=red-500, HIGH=orange-500, MEDIUM=blue-500, LOW=gray-400
- Overdue: text-red-500, Today: text-yellow-600, Con han: text-gray-500
