# 11-feat-realtime-fe - Context

> **Loai:** feat | **Phu thuoc:** 10-feat-realtime-be

## Reference
- `context/05-comments-realtime.md` - Frontend components, Notification Bell, Comment Section
- `context/overview.md` - Frontend tech stack

## Scope

Frontend cho Comments, Notifications va WebSocket client.

### Comment Section (trong Task Detail Modal)
```
+-----------------------------------+
| Comments (3)                       |
|------------------------------------|
| Av Minh - 2h truoc                 |
| Da fix xong phan login flow       |
| [Sua] [Xoa]                       |
|------------------------------------|
| Av An - 1h truoc                   |
| @Minh ok, check lai phan refresh  |
| token nhe                          |
|------------------------------------|
| [Nhap comment... @mention]        |
| [Gui]                             |
+-----------------------------------+
```

### Components
- **CommentSection.tsx** - Container comments trong TaskDetailModal
- **MentionInput.tsx** - Input voi @mention autocomplete
  - Go "@" -> dropdown danh sach members
  - Go tiep de filter ten
  - Click chon -> insert @ten (highlight xanh)
- **NotificationBell.tsx** - Icon chuong o header voi badge so chua doc
- **NotificationDropdown.tsx** - Dropdown danh sach thong bao

### Notification Bell (Header)
```
+-------+
| Bell(3)|  <- Badge so chua doc
+-------+
    |
    v (click)
+---------------------------+
| Thong bao                 |
|---------------------------|
| [new] Minh assigned task  |
|       "Fix login bug"     |
|       2 phut truoc        |
|---------------------------|
| [new] An commented on     |
|       "Setup Docker"      |
|       5 phut truoc        |
|---------------------------|
|       Xem tat ca ->       |
+---------------------------+
```

### WebSocket Client
- `src/services/socket.ts` - Socket.io client setup
- `src/hooks/useSocket.ts` - Hook connect/disconnect/listen events
- Connect voi JWT token: `io(WS_URL, { auth: { token } })`
- Listen events -> update TanStack Query cache (real-time UI)

## Rules
- @mention highlight xanh, click -> xem profile
- Chi nguoi viet comment moi thay nut Sua/Xoa
- Notification badge tu dong cap nhat qua WebSocket
- Real-time: task keo tren Kanban -> tat ca user thay card di chuyen
- Socket reconnect tu dong khi mat ket noi
