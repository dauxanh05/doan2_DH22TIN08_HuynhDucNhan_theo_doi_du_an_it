# 06-feat-project-task-fe - Context

> **Loai:** feat | **Phu thuoc:** 05-feat-project-task-be

## Reference
- `context/03-project-task-ai.md` - Frontend pages, Task Detail Modal layout
- `context/overview.md` - Frontend tech stack

## Scope

Frontend cho Project listing, Project detail, va Task Detail Modal.

### Pages
- **ProjectListPage** (`/workspaces/:wId/projects`) - Danh sach projects + tao moi
- **ProjectDetailPage** (`/projects/:id`) - Chi tiet project (chua Kanban placeholder)

### Task Detail Modal (overlay, giong Trello)
```
+------------------------------------------+
| [x] Task Title (editable)                |
|------------------------------------------|
| Status: [TODO v]  Priority: [MEDIUM v]   |
| Due: [Pick date]  Assignees: [+Add]      |
|------------------------------------------|
| Description (plain text area)            |
|------------------------------------------|
| Subtasks                                 |
| [ ] Subtask 1                            |
| [+ Add subtask]                          |
|------------------------------------------|
| Checklist                                |
| [x] Item 1                              |
| [+ Add item]                            |
|------------------------------------------|
| Attachments                             |
| [file1.pdf] [file2.png]                 |
| [+ Upload]                              |
+------------------------------------------+
```

### Components
- `TaskDetailModal.tsx` - Modal container
- `SubtaskList.tsx` - Danh sach subtasks
- `ChecklistSection.tsx` - Checklist items
- `AttachmentSection.tsx` - File attachments

## Rules
- Task detail la modal overlay (khong navigate sang trang moi)
- Description la plain text (khong rich text editor)
- Subtask hien thi nhu checklist don gian
- Attachments: upload + preview + download + delete
