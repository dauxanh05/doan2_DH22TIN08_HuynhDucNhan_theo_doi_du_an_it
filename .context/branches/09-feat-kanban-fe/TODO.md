# 09-feat-kanban-fe - TODO

## Reorder API (BE nho)
- [ ] PATCH /tasks/reorder endpoint (neu chua co tu nhanh 05)

## Kanban Components
- [ ] KanbanBoard - DndContext setup
- [ ] KanbanColumn - 1 cot voi droppable area
- [ ] TaskCard - draggable card voi title, priority, avatars, due date
- [ ] KanbanFilterBar - filter assignee + priority + search
- [ ] QuickAddTask - inline input them task

## Drag & Drop
- [ ] Install @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- [ ] Cross-column drag (cap nhat status)
- [ ] Same-column reorder (cap nhat position)
- [ ] Smooth animation

## Filter & Search
- [ ] Assignee multi-select dropdown
- [ ] Priority multi-select dropdown
- [ ] Search input voi debounce 300ms
- [ ] AND logic ket hop filters

## Styling
- [ ] Priority badge colors (red, orange, blue, gray)
- [ ] Overdue date styling (red, yellow, gray)
- [ ] Assignee avatar stack (max 3 + "+N")

## Test manual
- [ ] Test keo task giua cac cot
- [ ] Test reorder trong cung cot
- [ ] Test filter theo assignee
- [ ] Test filter theo priority
- [ ] Test search task
- [ ] Test ket hop nhieu filters
- [ ] Test quick add task
- [ ] Test click card mo modal
