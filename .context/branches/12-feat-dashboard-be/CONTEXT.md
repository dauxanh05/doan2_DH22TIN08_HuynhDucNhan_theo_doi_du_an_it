# 12-feat-dashboard-be - Context

> **Loai:** feat | **Phu thuoc:** 11-feat-realtime-fe

## Reference
- `context/06-dashboard-reports.md` - Chi tiet Dashboard & Reports specs
- `context/overview.md` - Database schema

## Scope

Backend API cho Dashboard stats va Activity feed.

### Dashboard Stats API
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
```

### Activity Feed API
```
GET /workspaces/:id/dashboard/activity
Query: { page, limit }
Response: {
  activities: [
    { type, userId, userName, userAvatar, description, createdAt, data }
  ],
  total: number
}
```

### Activity Types
- Task created/updated/completed/deleted
- Comment added
- Member joined/left
- Project created

> **Note:** Co the can them bang `Activity` trong DB hoac generate tu events co san.

## Rules
- Stats tinh toan tu du lieu hien co (tasks, members)
- Overdue = dueDate < today AND status != DONE
- Member workload = so task assign voi status != DONE
- Activity feed: max 20 items/page, co pagination
- Tat ca endpoints can auth + workspace membership
