# Phan 5: Comments & Real-time

> **Quyet dinh:** Comment voi @mention, WebSocket (Socket.io) cho real-time

---

## Tong quan

Phan nay giup team giao tiep trong task va thay thay doi ngay lap tuc khong can reload.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Comments | Add, Edit, Delete |
| @mention | **Co** - autocomplete dropdown + gui notification |
| Real-time | **WebSocket** (Socket.io) |
| Notifications | In-app notification bell |

---

## Comments

### API Endpoints
```
GET    /tasks/:taskId/comments            # Danh sach comments
POST   /tasks/:taskId/comments            # Them comment
PATCH  /comments/:id                      # Sua comment (chi nguoi viet)
DELETE /comments/:id                      # Xoa comment (chi nguoi viet)
```

### Database
```prisma
model Comment {
  id        String   @id @default(cuid())
  taskId    String
  userId    String
  content   String
  mentions  String[] // User IDs duoc @mention
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  task      Task     @relation(...)
  user      User     @relation(...)
}
```

### @Mention Flow
```
1. User go "@" trong comment input
   -> Hien dropdown danh sach members trong workspace
   -> User go tiep de filter ten
   -> Click chon member

2. Submit comment
   -> Backend parse mentions tu content (hoac nhan tu frontend)
   -> Luu mentions[] (array user IDs)
   -> Tao Notification cho moi user duoc mention
   -> Gui WebSocket event cho user duoc mention

3. Hien thi
   -> @ten hien thi mau khac (highlight xanh)
   -> Click vao @ten -> xem profile member
```

---

## Notifications

### API Endpoints
```
GET    /notifications                     # Danh sach (paginated)
PATCH  /notifications/:id/read            # Danh dau da doc
POST   /notifications/read-all            # Doc tat ca
GET    /notifications/unread-count        # So thong bao chua doc
```

### Database
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String
  data      Json?    // { taskId, projectId, commentId, etc. }
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(...)
}

enum NotificationType {
  TASK_ASSIGNED
  TASK_UPDATED
  TASK_COMPLETED
  COMMENT_ADDED
  COMMENT_MENTION
  DEADLINE_APPROACHING
  INVITATION_RECEIVED
}
```

### Khi nao tao Notification
| Event | NotificationType | Ai nhan |
|-------|-----------------|---------|
| Assign task cho user | TASK_ASSIGNED | User duoc assign |
| Task duoc cap nhat | TASK_UPDATED | Tat ca assignees |
| Task chuyen sang DONE | TASK_COMPLETED | Tat ca assignees |
| Comment moi trong task | COMMENT_ADDED | Tat ca assignees (tru nguoi comment) |
| @mention trong comment | COMMENT_MENTION | User duoc mention |
| Task sap het han (1 ngay) | DEADLINE_APPROACHING | Tat ca assignees |
| Moi vao workspace | INVITATION_RECEIVED | User duoc moi |

---

## WebSocket (Real-time)

### Thu vien: Socket.io
- Backend: `@nestjs/websockets` + `socket.io`
- Frontend: `socket.io-client`

### Architecture
```
Frontend (socket.io-client)
    |
    | connect (gui JWT token de xac thuc)
    |
Backend (NestJS WebSocket Gateway)
    |
    | Rooms: workspace:{workspaceId}
    |
    | Events: task_created, task_updated, task_deleted,
    |         comment_added, notification
```

### Events

#### Client -> Server
```
join_workspace    { workspaceId }    // Khi user vao workspace
leave_workspace   { workspaceId }    // Khi user roi workspace
```

#### Server -> Client
```
task_created      { task }           // Task moi duoc tao
task_updated      { task }           // Task duoc cap nhat (status, title...)
task_deleted      { taskId }         // Task bi xoa
comment_added     { comment }        // Comment moi
notification      { notification }   // Thong bao moi
```

### WebSocket Authentication
```
1. Frontend connect voi auth token
   -> socket = io(WS_URL, { auth: { token: accessToken } })

2. Backend Gateway verify token
   -> handleConnection(client) -> verify JWT -> attach user to socket

3. Neu token het han -> disconnect -> frontend reconnect voi token moi
```

### Real-time on Kanban
- Khi ai do keo task sang cot khac:
  - Backend emit `task_updated` voi status moi
  - Tat ca user dang xem Kanban cung project se thay card tu dong di chuyen

---

## Frontend Components

### Notification Bell (Header)
```
+-------+
| 🔔 (3) |  <- Badge so thong bao chua doc
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

### Comment Section (trong Task Detail Modal)
```
+-----------------------------------+
| Comments (3)                       |
|------------------------------------|
| 👤 Minh - 2h truoc                 |
| Da fix xong phan login flow       |
| [Sua] [Xoa]                       |
|------------------------------------|
| 👤 An - 1h truoc                   |
| @Minh ok, check lai phan refresh  |
| token nhe                          |
|------------------------------------|
| [Nhap comment... @mention]        |
| [Gui]                             |
+-----------------------------------+
```

---

## Files can tao/cap nhat

### Backend
- `src/modules/comments/comments.module.ts`
- `src/modules/comments/comments.controller.ts`
- `src/modules/comments/comments.service.ts`
- `src/modules/comments/dto/*.ts`
- `src/modules/notifications/notifications.module.ts`
- `src/modules/notifications/notifications.controller.ts`
- `src/modules/notifications/notifications.service.ts`
- **`src/modules/notifications/notifications.gateway.ts`** (WebSocket gateway)

### Frontend
- `src/components/NotificationBell.tsx`
- `src/components/NotificationDropdown.tsx`
- `src/features/tasks/CommentSection.tsx`
- `src/features/tasks/MentionInput.tsx`
- `src/services/socket.ts` (Socket.io client setup)
- `src/hooks/useSocket.ts`

---

*Last updated: 2026-02-15*
