# Phan 4: Kanban Board

> **Quyet dinh:** 3 cot co dinh, card hien thi day du, filter co ban

---

## Tong quan

Kanban Board la giao dien chinh ma user tuong tac hang ngay. Bang keo tha giong Trello.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Columns | **3 cot co dinh**: TODO, IN_PROGRESS, DONE |
| Card info | **Ca 4**: Title, Priority badge, Assignee avatars, Due date |
| Filter/Search | **Co ban**: assignee + priority + search ten |
| Drag-drop | Giu nguyen (dung @dnd-kit) |
| Quick add | Giu nguyen (nut "+" moi cot) |
| Click card | Mo Task Detail Modal |

---

## Kanban Layout

```
+------------------------------------------------------------------+
| [Filter: Assignee ▼] [Priority ▼] [Search: ________]            |
|------------------------------------------------------------------|
| TODO (5)          | IN_PROGRESS (3)   | DONE (8)                 |
|-------------------|-------------------|--------------------------|
| +--Card--------+  | +--Card--------+  | +--Card--------+        |
| | Task title   |  | | Task title   |  | | Task title   |        |
| | [URGENT] red |  | | [HIGH] orange|  | | [LOW] gray   |        |
| | 👤👤  📅 2/20 |  | | 👤    📅 2/18 |  | | 👤👤👤 📅 2/15 |        |
| +--------------+  | +--------------+  | +--------------+        |
|                   |                   |                          |
| +--Card--------+  | +--Card--------+  |                          |
| | Task title   |  | | Task title   |  |                          |
| | [MEDIUM] blue|  | | [MEDIUM] blue|  |                          |
| | 👤    📅 2/25 |  | |              |  |                          |
| +--------------+  | +--------------+  |                          |
|                   |                   |                          |
| [+ Them task]     | [+ Them task]     | [+ Them task]            |
+------------------------------------------------------------------+
```

---

## Task Card Component

### Thong tin hien thi tren card
| Element | Mo ta | Visual |
|---------|-------|--------|
| Title | Ten task (max 2 dong, ellipsis) | Text |
| Priority badge | Mau sac theo muc do | URGENT=red, HIGH=orange, MEDIUM=blue, LOW=gray |
| Assignee avatars | Avatar tron nho, xep chong (max 3, +N) | Circle avatars |
| Due date | Ngay het han, do neu overdue | Icon + date text |

### Priority Colors
```
URGENT  -> bg-red-500    text-white
HIGH    -> bg-orange-500 text-white
MEDIUM  -> bg-blue-500   text-white
LOW     -> bg-gray-400   text-white
```

### Overdue Styling
- Due date da qua -> text-red-500, border-red
- Due date hom nay -> text-yellow-600
- Due date con han -> text-gray-500

---

## Drag & Drop

### Thu vien: @dnd-kit
- `@dnd-kit/core` - Core drag-drop
- `@dnd-kit/sortable` - Sortable trong column
- `@dnd-kit/utilities` - CSS transform helpers

### Hanh vi
1. **Keo giua cac cot** (cross-column):
   - Keo task tu TODO sang IN_PROGRESS = cap nhat `status`
   - Goi API: `PATCH /tasks/:id { status: "IN_PROGRESS" }`

2. **Keo trong cung cot** (same-column reorder):
   - Doi vi tri task trong column = cap nhat `position`
   - Goi API: `PATCH /tasks/reorder { tasks: [{ id, position }] }`

3. **Animation**: Smooth transition khi keo/tha

---

## Filter & Search

### Filter bar (phia tren Kanban)
```
[Assignee: Tat ca ▼] [Priority: Tat ca ▼] [🔍 Tim kiem...]
```

| Filter | Loai | Mo ta |
|--------|------|-------|
| Assignee | Dropdown multi-select | Loc theo nguoi duoc assign |
| Priority | Dropdown multi-select | Loc theo URGENT/HIGH/MEDIUM/LOW |
| Search | Text input (debounce) | Tim theo ten task |

### Filter logic
- Filter ap dung phia **frontend** (client-side) vi so luong task/project khong lon
- Search: debounce 300ms, case-insensitive
- Ket hop filter: AND logic (assignee AND priority AND search)

---

## Quick Add Task

- Moi cot co nut "+ Them task" o cuoi
- Click -> hien input text inline
- Nhap ten task + Enter = tao task voi status tuong ung cot do
- Escape = huy

---

## API lien quan

```
GET    /projects/:projectId/tasks    # Lay tat ca tasks (cho Kanban)
PATCH  /tasks/:id                    # Cap nhat status khi drag-drop
PATCH  /tasks/reorder                # Cap nhat position khi reorder
POST   /projects/:projectId/tasks    # Quick add task
```

---

## Frontend Components

| Component | Mo ta |
|-----------|-------|
| `KanbanBoard.tsx` | Container chinh, setup DndContext |
| `KanbanColumn.tsx` | 1 cot (TODO/IN_PROGRESS/DONE), chua danh sach cards |
| `TaskCard.tsx` | 1 card task (draggable) |
| `KanbanFilterBar.tsx` | Thanh filter + search phia tren |
| `QuickAddTask.tsx` | Input inline them task nhanh |

---

## Files can tao/cap nhat

### Frontend
- `src/features/kanban/KanbanPage.tsx`
- `src/features/kanban/KanbanBoard.tsx`
- `src/features/kanban/KanbanColumn.tsx`
- `src/features/kanban/TaskCard.tsx`
- `src/features/kanban/KanbanFilterBar.tsx`
- `src/features/kanban/QuickAddTask.tsx`

### Backend
- Tasks API da duoc dinh nghia trong Phan 3

---

## Verification Checklist

- [ ] Kanban hien thi 3 cot: TODO, IN_PROGRESS, DONE
- [ ] Task card hien thi: title, priority badge, assignee avatars, due date
- [ ] Keo task tu cot nay sang cot khac → update status
- [ ] Keo task trong cung cot → update position
- [ ] Filter theo assignee hoat dong
- [ ] Filter theo priority hoat dong
- [ ] Search theo ten task (debounce 300ms)
- [ ] Ket hop 3 filters (AND logic)
- [ ] Quick add task inline moi cot
- [ ] Task overdue hien thi mau do
- [ ] Task due hom nay hien thi mau vang
- [ ] Click card → mo Task Detail Modal
- [ ] Animation smooth khi drag-drop

## Edge Cases & Error Responses

| Case | Endpoint/UI | Status | Response |
|------|-------------|--------|----------|
| Khong co tasks | UI | - | Hien empty state "Chua co task nao" |
| Reorder fail (network error) | PATCH /tasks/reorder | 500 | Rollback vi tri card ve cho cu (optimistic update revert) |
| Status update fail khi keo | PATCH /tasks/:id | 500 | Card quay ve cot cu, hien toast error |
| Filter khong co ket qua | UI | - | Hien "Khong tim thay task phu hop" |
| Task title qua dai | UI | - | Ellipsis sau 2 dong |
| Nhieu nguoi keo cung task | WebSocket conflict | - | Last write wins, real-time update cho nguoi con lai |

---

*Last updated: 2026-02-27*
