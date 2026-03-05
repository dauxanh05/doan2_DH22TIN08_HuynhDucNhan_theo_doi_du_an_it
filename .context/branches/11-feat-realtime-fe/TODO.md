# 11-feat-realtime-fe - TODO

## WebSocket Client
- [ ] Setup `socket.ts` - Socket.io client instance
- [ ] Setup `useSocket.ts` hook - connect/disconnect/listen
- [ ] JWT authentication khi connect
- [ ] Auto reconnect khi mat ket noi
- [ ] Listen events -> update TanStack Query cache

## Comment Section
- [ ] CommentSection - danh sach comments trong TaskDetailModal
- [ ] MentionInput - input voi @mention autocomplete
- [ ] @mention dropdown filter members
- [ ] @mention highlight xanh trong comment
- [ ] Sua/Xoa comment (chi nguoi viet)
- [ ] API hooks: useComments(), useCreateComment(), useUpdateComment(), useDeleteComment()

## Notifications
- [ ] NotificationBell - icon chuong voi badge
- [ ] NotificationDropdown - danh sach thong bao
- [ ] Mark as read (click vao notification)
- [ ] Mark all as read
- [ ] Real-time badge update qua WebSocket
- [ ] API hooks: useNotifications(), useUnreadCount(), useMarkRead()

## Real-time Integration
- [ ] Kanban: task_created/updated/deleted -> cap nhat board
- [ ] TaskDetailModal: comment_added -> cap nhat comments
- [ ] Header: notification -> cap nhat badge

## Test manual
- [ ] Test them comment
- [ ] Test @mention autocomplete
- [ ] Test sua/xoa comment
- [ ] Test notification bell + badge
- [ ] Test mark as read
- [ ] Test real-time task update tren Kanban
- [ ] Test real-time comment
- [ ] Test real-time notification
