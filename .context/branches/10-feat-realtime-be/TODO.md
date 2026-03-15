# 10-feat-realtime-be - TODO

## Comments Module
- [x] Tao `comments.module.ts`
- [x] Tao `comments.controller.ts`
- [x] Tao `comments.service.ts`
- [x] Tao DTOs: create-comment.dto.ts, update-comment.dto.ts
- [x] GET /tasks/:taskId/comments
- [x] POST /tasks/:taskId/comments (voi mentions)
- [x] PATCH /comments/:id (chi nguoi viet)
- [x] DELETE /comments/:id (chi nguoi viet)
- [x] @mention -> tao notifications

## Notifications Module
- [x] Tao `notifications.module.ts`
- [x] Tao `notifications.controller.ts`
- [x] Tao `notifications.service.ts`
- [x] GET /notifications (paginated)
- [x] PATCH /notifications/:id/read
- [x] POST /notifications/read-all
- [x] GET /notifications/unread-count
- [x] Auto-create notifications cho cac events (assign, update, complete, comment, mention, deadline, invite)

## WebSocket Gateway
- [x] Tao `notifications.gateway.ts`
- [x] Setup Socket.io trong NestJS
- [x] JWT authentication khi connect
- [x] Room management (join/leave workspace)
- [x] Emit events: task_created, task_updated, task_deleted, comment_added, notification

## Test manual
- [ ] Test CRUD comments
- [ ] Test @mention tao notification
- [ ] Test danh sach notifications
- [ ] Test mark as read
- [ ] Test WebSocket connection voi JWT
- [ ] Test real-time task update
- [ ] Test real-time comment
- [ ] Test real-time notification
