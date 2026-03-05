# 05-feat-project-task-be - TODO

## Project Module
- [ ] Tao `projects.module.ts`
- [ ] Tao `projects.controller.ts`
- [ ] Tao `projects.service.ts`
- [ ] Tao DTOs: create-project.dto.ts, update-project.dto.ts
- [ ] POST /workspaces/:workspaceId/projects
- [ ] GET /workspaces/:workspaceId/projects
- [ ] GET /projects/:id
- [ ] PATCH /projects/:id
- [ ] DELETE /projects/:id
- [ ] GET /projects/:id/stats

## Task Module
- [ ] Tao `tasks.module.ts`
- [ ] Tao `tasks.controller.ts`
- [ ] Tao `tasks.service.ts`
- [ ] Tao DTOs: create-task.dto.ts, update-task.dto.ts, reorder-task.dto.ts
- [ ] POST /projects/:projectId/tasks
- [ ] GET /projects/:projectId/tasks (filter, sort)
- [ ] GET /tasks/:id
- [ ] PATCH /tasks/:id
- [ ] DELETE /tasks/:id
- [ ] PATCH /tasks/reorder

## Sub-features
- [ ] POST /tasks/:id/subtasks (max 2 levels)
- [ ] POST /tasks/:id/assignees
- [ ] DELETE /tasks/:id/assignees/:userId
- [ ] GET /tasks/:id/checklists
- [ ] POST /tasks/:id/checklists
- [ ] PATCH /checklists/:id
- [ ] DELETE /checklists/:id

## File Upload Module
- [ ] Tao `files.module.ts`
- [ ] Tao `files.controller.ts`
- [ ] Tao `files.service.ts`
- [ ] POST /tasks/:id/attachments (upload)
- [ ] DELETE /attachments/:id
- [ ] Validate file type + size

## Test manual
- [ ] Test CRUD project
- [ ] Test CRUD task
- [ ] Test subtasks (max 2 levels)
- [ ] Test assign/unassign user
- [ ] Test checklist CRUD
- [ ] Test file upload + delete
- [ ] Test reorder tasks
- [ ] Test project stats
