# 11-feat-realtime-fe - TODO

## WebSocket Client
- [x] Setup `socket.ts` - Socket.io client instance
- [x] Setup `useSocket.ts` hook - connect/disconnect/listen
- [x] JWT authentication khi connect
- [x] Auto reconnect khi mat ket noi
- [x] Listen events -> update TanStack Query cache

## Comment Section
- [x] CommentSection - danh sach comments trong TaskDetailModal
- [x] MentionInput - input voi @mention autocomplete
- [x] @mention dropdown filter members
- [x] @mention highlight xanh trong comment
- [x] Sua/Xoa comment (chi nguoi viet)
- [x] API hooks: useComments(), useCreateComment(), useUpdateComment(), useDeleteComment()

## Notifications
- [x] NotificationBell - icon chuong voi badge
- [x] NotificationDropdown - danh sach thong bao
- [x] Mark as read (click vao notification)
- [x] Mark all as read
- [x] Real-time badge update qua WebSocket
- [x] API hooks: useNotifications(), useUnreadCount(), useMarkRead()

## Real-time Integration
- [x] Kanban: task_created/updated/deleted -> cap nhat board
- [x] TaskDetailModal: comment_added -> cap nhat comments
- [x] Header: notification -> cap nhat badge

## Test manual
- [ ] Test them comment
- [ ] Test @mention autocomplete
- [ ] Test sua/xoa comment
- [ ] Test notification bell + badge
- [ ] Test mark as read
- [ ] Test real-time task update tren Kanban
- [ ] Test real-time comment
- [ ] Test real-time notification
