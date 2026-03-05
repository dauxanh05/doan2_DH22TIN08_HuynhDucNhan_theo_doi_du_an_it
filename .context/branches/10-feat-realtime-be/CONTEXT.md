# 10-feat-realtime-be - Context

> **Loai:** feat | **Phu thuoc:** 09-feat-kanban-fe

## Reference
- `context/05-comments-realtime.md` - Chi tiet Comments, Notifications, WebSocket specs
- `context/overview.md` - Tech stack (Socket.io)

## Scope

Backend cho Comments, Notifications va WebSocket Gateway. Gop chung 3 thanh phan vi chung lien quan chat.

### Comments Module (`src/modules/comments/`)
```
GET    /tasks/:taskId/comments            # Danh sach comments
POST   /tasks/:taskId/comments            # Them comment
PATCH  /comments/:id                      # Sua comment (chi nguoi viet)
DELETE /comments/:id                      # Xoa comment (chi nguoi viet)
```

#### @Mention Flow
1. Frontend gui comment voi mentions[] (array user IDs)
2. Backend luu mentions vao Comment record
3. Tao Notification cho moi user duoc mention (type: COMMENT_MENTION)
4. Emit WebSocket event cho user duoc mention

### Notifications Module (`src/modules/notifications/`)
```
GET    /notifications                     # Danh sach (paginated)
PATCH  /notifications/:id/read            # Danh dau da doc
POST   /notifications/read-all            # Doc tat ca
GET    /notifications/unread-count        # So chua doc
```

#### Khi nao tao Notification
| Event | Type | Ai nhan |
|-------|------|---------|
| Assign task | TASK_ASSIGNED | User duoc assign |
| Task cap nhat | TASK_UPDATED | Tat ca assignees |
| Task DONE | TASK_COMPLETED | Tat ca assignees |
| Comment moi | COMMENT_ADDED | Tat ca assignees (tru nguoi comment) |
| @mention | COMMENT_MENTION | User duoc mention |
| Task sap het han | DEADLINE_APPROACHING | Tat ca assignees |
| Moi workspace | INVITATION_RECEIVED | User duoc moi |

### WebSocket Gateway (`src/modules/notifications/notifications.gateway.ts`)
- Thu vien: `@nestjs/websockets` + `socket.io`
- Authentication: verify JWT token khi connect
- Rooms: `workspace:{workspaceId}`

#### Events
**Client -> Server:**
- `join_workspace { workspaceId }` - Khi user vao workspace
- `leave_workspace { workspaceId }` - Khi user roi workspace

**Server -> Client:**
- `task_created { task }`, `task_updated { task }`, `task_deleted { taskId }`
- `comment_added { comment }`
- `notification { notification }`

## Rules
- Chi nguoi viet comment moi duoc sua/xoa
- WebSocket auth: verify JWT khi handleConnection
- Token het han -> disconnect -> frontend reconnect voi token moi
- Real-time task updates cho Kanban (ai keo task -> tat ca user thay)
