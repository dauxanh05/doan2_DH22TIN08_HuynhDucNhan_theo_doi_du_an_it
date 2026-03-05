# 05-feat-project-task-be - Context

> **Loai:** feat | **Phu thuoc:** 04-feat-workspace-fe

## Reference
- `context/03-project-task-ai.md` - Chi tiet Project, Task specs (phan Project + Task, KHONG phan AI)
- `context/overview.md` - Database schema

## Scope

Backend cho Project CRUD, Task CRUD va cac sub-features (subtasks, assignees, checklist, attachments, file upload).

### Project Endpoints
```
POST   /workspaces/:workspaceId/projects  # Tao project
GET    /workspaces/:workspaceId/projects  # Danh sach projects
GET    /projects/:id                      # Chi tiet project
PATCH  /projects/:id                      # Cap nhat project
DELETE /projects/:id                      # Xoa project
GET    /projects/:id/stats                # Thong ke project
```

### Task Endpoints
```
POST   /projects/:projectId/tasks         # Tao task
GET    /projects/:projectId/tasks         # Danh sach tasks (filter, sort)
GET    /tasks/:id                         # Chi tiet task
PATCH  /tasks/:id                         # Cap nhat task
DELETE /tasks/:id                         # Xoa task
PATCH  /tasks/reorder                     # Sap xep lai (drag-drop)
```

### Sub-features Endpoints
```
POST   /tasks/:id/subtasks                # Tao subtask
POST   /tasks/:id/assignees               # Assign user
DELETE /tasks/:id/assignees/:userId       # Unassign user
GET    /tasks/:id/checklists              # Lay checklist items
POST   /tasks/:id/checklists              # Them checklist item
PATCH  /checklists/:id                    # Cap nhat item
DELETE /checklists/:id                    # Xoa item
POST   /tasks/:id/attachments             # Upload file
DELETE /attachments/:id                   # Xoa file
```

### File Upload Module (`src/modules/files/`)
- Upload file vao local storage (`./uploads`)
- Validate file type, size
- Tra ve file path

## Rules
- Subtasks chi co 2 levels (task -> subtask, khong co subtask cua subtask)
- Task position dung Int, cap nhat khi reorder
- completedAt tu dong set khi status chuyen sang DONE
- Project thuoc workspace, task thuoc project
- Phan quyen: OWNER/ADMIN/MEMBER co the CRUD, VIEWER chi xem
