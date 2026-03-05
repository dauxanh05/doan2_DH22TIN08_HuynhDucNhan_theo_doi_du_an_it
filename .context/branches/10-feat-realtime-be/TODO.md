# 10-feat-realtime-be - TODO

## Comments Module
- [ ] Tao `comments.module.ts`
- [ ] Tao `comments.controller.ts`
- [ ] Tao `comments.service.ts`
- [ ] Tao DTOs: create-comment.dto.ts, update-comment.dto.ts
- [ ] GET /tasks/:taskId/comments
- [ ] POST /tasks/:taskId/comments (voi mentions)
- [ ] PATCH /comments/:id (chi nguoi viet)
- [ ] DELETE /comments/:id (chi nguoi viet)
- [ ] @mention -> tao notifications

## Notifications Module
- [ ] Tao `notifications.module.ts`
- [ ] Tao `notifications.controller.ts`
- [ ] Tao `notifications.service.ts`
- [ ] GET /notifications (paginated)
- [ ] PATCH /notifications/:id/read
- [ ] POST /notifications/read-all
- [ ] GET /notifications/unread-count
- [ ] Auto-create notifications cho cac events (assign, update, complete, comment, mention, deadline, invite)

## WebSocket Gateway
- [ ] Tao `notifications.gateway.ts`
- [ ] Setup Socket.io trong NestJS
- [ ] JWT authentication khi connect
- [ ] Room management (join/leave workspace)
- [ ] Emit events: task_created, task_updated, task_deleted, comment_added, notification

## Test manual
- [ ] Test CRUD comments
- [ ] Test @mention tao notification
- [ ] Test danh sach notifications
- [ ] Test mark as read
- [ ] Test WebSocket connection voi JWT
- [ ] Test real-time task update
- [ ] Test real-time comment
- [ ] Test real-time notification
