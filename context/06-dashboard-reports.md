# Phan 6: Dashboard & Reports

> **Quyet dinh:** Day du widgets, Recharts bieu do, member workload

---

## Tong quan

Trang Dashboard la trang tong quan khi user vao app, hien thi bieu do va thong ke.

### Quyet dinh da thong nhat
| Feature | Quyet dinh |
|---------|-----------|
| Widgets | **Ca 4**: Project progress, Tasks by status, Overdue tasks, Recent activity |
| Charts | **Co** - dung Recharts |
| Member Workload | **Co** - bieu do so task moi member |

---

## Dashboard Layout

```
+------------------------------------------------------------------+
| Dashboard - [Workspace Name]                                      |
|------------------------------------------------------------------|
| +--Project Progress--------+  +--Tasks by Status---------+       |
| | Project A    [====75%===] |  |    +---------+           |       |
| | Project B    [==40%=====] |  |    | PIE     |           |       |
| | Project C    [=20%======] |  |    | CHART   |           |       |
| |                           |  |    +---------+           |       |
| | [Xem tat ca projects ->] |  | TODO: 12  DOING: 5      |       |
| +---------------------------+  | DONE: 18                 |       |
|                                +---------------------------+       |
|                                                                   |
| +--Overdue Tasks------------+  +--Member Workload---------+       |
| | ⚠ Fix login bug           |  |    +----------+          |       |
| |   Qua han 3 ngay          |  |    | BAR      |          |       |
| |   👤 Minh                  |  |    | CHART    |          |       |
| |                           |  |    +----------+          |       |
| | ⚠ Setup Docker            |  | Minh: 8  An: 5         |       |
| |   Qua han 1 ngay          |  | Binh: 3                 |       |
| |   👤 An                    |  +---------------------------+       |
| +---------------------------+                                     |
|                                                                   |
| +--Recent Activity--------------------------------------------+   |
| | 👤 Minh completed "Fix login bug"              2 phut truoc |   |
| | 👤 An  commented on "Setup Docker"             5 phut truoc |   |
| | 👤 Binh created task "Design landing page"    10 phut truoc |   |
| | 👤 Minh moved "API testing" to IN_PROGRESS    15 phut truoc |   |
| +-------------------------------------------------------------+   |
+------------------------------------------------------------------+
```

---

## Widgets chi tiet

### 1. Project Progress
- Danh sach cac project trong workspace
- Moi project co progress bar: % = (tasks DONE / tong tasks) * 100
- Mau sac theo project color
- Click vao project -> navigate den project detail

### 2. Tasks by Status (Pie/Bar Chart)
- Bieu do tron hoac cot
- 3 phan: TODO, IN_PROGRESS, DONE
- Mau sac: TODO=gray, IN_PROGRESS=blue, DONE=green
- Hien thi so luong + %
- Data: tong tat ca tasks trong workspace (hoac filter theo project)

### 3. Overdue Tasks
- Danh sach tasks co dueDate < hom nay va status != DONE
- Sap xep theo overdue nhieu nhat truoc
- Hien thi: title, qua han bao nhieu ngay, assignees
- Click vao task -> mo Task Detail Modal
- Badge so luong overdue tren header

### 4. Recent Activity
- Feed cac hoat dong gan day trong workspace
- Loai activity:
  - Task created/updated/completed/deleted
  - Comment added
  - Member joined/left
  - Project created
- Hien thi: avatar + ten nguoi + hanh dong + thoi gian
- Max 20 items gan nhat, co pagination "Xem them"

### 5. Member Workload (Bar Chart)
- Bieu do cot ngang
- Moi member = 1 thanh (bar)
- Gia tri = so task dang duoc assign (status != DONE)
- Sap xep: nhieu task nhat o tren
- Giup leader biet ai dang overload, ai con trong

---

## API Endpoints

### Dashboard Stats (can tao moi)
```
GET /workspaces/:id/dashboard/stats
Response: {
  projectsProgress: [
    { projectId, name, color, totalTasks, completedTasks, percentage }
  ],
  tasksByStatus: {
    TODO: number,
    IN_PROGRESS: number,
    DONE: number
  },
  overdueTasks: [
    { id, title, dueDate, daysOverdue, assignees }
  ],
  memberWorkload: [
    { userId, name, avatar, activeTasks }
  ]
}

GET /workspaces/:id/dashboard/activity
Query: { page, limit }
Response: {
  activities: [
    { type, userId, userName, userAvatar, description, createdAt, data }
  ],
  total: number
}
```

> **Note:** Co the can them bang `Activity` trong DB de luu activity log.
> Hoac generate activity tu cac events co san (task created, comment added...).

---

## Charts (Recharts)

### Thu vien: recharts
```
import { PieChart, Pie, BarChart, Bar, Cell, Tooltip, Legend } from 'recharts';
```

### Tasks by Status - Pie Chart
```jsx
const data = [
  { name: 'TODO', value: 12, color: '#9CA3AF' },
  { name: 'IN_PROGRESS', value: 5, color: '#3B82F6' },
  { name: 'DONE', value: 18, color: '#22C55E' },
];
```

### Member Workload - Bar Chart
```jsx
const data = [
  { name: 'Minh', tasks: 8 },
  { name: 'An', tasks: 5 },
  { name: 'Binh', tasks: 3 },
];
```

---

## Frontend Components

| Component | Mo ta |
|-----------|-------|
| `DashboardPage.tsx` | Trang chinh, layout grid cac widgets |
| `ProjectProgressWidget.tsx` | Widget danh sach project + progress bar |
| `TasksStatusChart.tsx` | Pie chart tasks by status |
| `OverdueTasksWidget.tsx` | Danh sach task qua han |
| `RecentActivityWidget.tsx` | Feed hoat dong gan day |
| `MemberWorkloadChart.tsx` | Bar chart workload |

---

## Files can tao/cap nhat

### Backend
- `src/modules/workspaces/workspaces.controller.ts` (them dashboard endpoints)
- `src/modules/workspaces/workspaces.service.ts` (them dashboard logic)
- Hoac tao module rieng: `src/modules/dashboard/`

### Frontend
- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/ProjectProgressWidget.tsx`
- `src/features/dashboard/TasksStatusChart.tsx`
- `src/features/dashboard/OverdueTasksWidget.tsx`
- `src/features/dashboard/RecentActivityWidget.tsx`
- `src/features/dashboard/MemberWorkloadChart.tsx`

---

*Last updated: 2026-02-15*
