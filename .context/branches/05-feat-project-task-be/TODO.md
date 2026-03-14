# 05-feat-project-task-be - TODO

## Project Module
- [x] Tao `projects.module.ts`
- [x] Tao `projects.controller.ts`
- [x] Tao `projects.service.ts`
- [x] Tao DTOs: create-project.dto.ts, update-project.dto.ts
- [x] POST /workspaces/:workspaceId/projects
- [x] GET /workspaces/:workspaceId/projects
- [x] GET /projects/:id
- [x] PATCH /projects/:id
- [x] DELETE /projects/:id
- [x] GET /projects/:id/stats

## Task Module
- [x] Tao `tasks.module.ts`
- [x] Tao `tasks.controller.ts`
- [x] Tao `tasks.service.ts`
- [x] Tao DTOs: create-task.dto.ts, update-task.dto.ts, reorder-task.dto.ts
- [x] POST /projects/:projectId/tasks
- [x] GET /projects/:projectId/tasks (filter, sort)
- [x] GET /tasks/:id
- [x] PATCH /tasks/:id
- [x] DELETE /tasks/:id
- [x] PATCH /tasks/reorder

## Sub-features
- [x] POST /tasks/:id/subtasks (max 2 levels)
- [x] POST /tasks/:id/assignees
- [x] DELETE /tasks/:id/assignees/:userId
- [x] GET /tasks/:id/checklists
- [x] POST /tasks/:id/checklists
- [x] PATCH /checklists/:id
- [x] DELETE /checklists/:id

## File Upload Module
- [x] Tao `files.module.ts`
- [x] Tao `files.controller.ts`
- [x] Tao `files.service.ts`
- [x] POST /tasks/:id/attachments (upload)
- [x] DELETE /attachments/:id
- [x] Validate file type + size

## Test manual
- [x] Test CRUD project
- [x] Test CRUD task
- [x] Test subtasks (max 2 levels)
- [x] Test assign/unassign user
- [x] Test checklist CRUD
- [x] Test file upload + delete
- [x] Test reorder tasks
- [x] Test project stats
