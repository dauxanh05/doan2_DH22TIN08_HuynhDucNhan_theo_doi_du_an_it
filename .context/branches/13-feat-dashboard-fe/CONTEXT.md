# 13-feat-dashboard-fe - Context

> **Loai:** feat | **Phu thuoc:** 12-feat-dashboard-be

## Reference
- `context/06-dashboard-reports.md` - Dashboard layout, widgets, Recharts
- `context/overview.md` - Frontend tech stack

## Scope

Frontend Dashboard voi 5 widgets va Recharts bieu do.

### Dashboard Layout
```
+------------------------------------------------------------------+
| Dashboard - [Workspace Name]                                      |
|------------------------------------------------------------------|
| +--Project Progress--------+  +--Tasks by Status---------+       |
| | Project A    [====75%===] |  |    +---------+           |       |
| | Project B    [==40%=====] |  |    | PIE     |           |       |
| | Project C    [=20%======] |  |    | CHART   |           |       |
| | [Xem tat ca projects ->] |  |    +---------+           |       |
| +---------------------------+  +---------------------------+       |
|                                                                   |
| +--Overdue Tasks------------+  +--Member Workload---------+       |
| | ! Fix login bug           |  |    +----------+          |       |
| |   Qua han 3 ngay          |  |    | BAR      |          |       |
| | ! Setup Docker            |  |    | CHART    |          |       |
| |   Qua han 1 ngay          |  |    +----------+          |       |
| +---------------------------+  +---------------------------+       |
|                                                                   |
| +--Recent Activity--------------------------------------------+   |
| | Av Minh completed "Fix login bug"              2 phut truoc |   |
| | Av An  commented on "Setup Docker"             5 phut truoc |   |
| +-------------------------------------------------------------+   |
+------------------------------------------------------------------+
```

### 5 Widgets
1. **ProjectProgressWidget** - Progress bar moi project (% DONE/total)
2. **TasksStatusChart** - Pie chart (Recharts): TODO, IN_PROGRESS, DONE
3. **OverdueTasksWidget** - Danh sach tasks qua han
4. **MemberWorkloadChart** - Bar chart (Recharts): so active tasks moi member
5. **RecentActivityWidget** - Feed hoat dong gan day (paginated)

### Recharts
```jsx
import { PieChart, Pie, BarChart, Bar, Cell, Tooltip, Legend } from 'recharts';
```
- Tasks by Status: Pie chart voi 3 mau (gray, blue, green)
- Member Workload: Bar chart ngang

## Rules
- Install recharts
- Responsive grid layout (2 cot tren desktop, 1 cot tren mobile)
- Click project -> navigate den project detail
- Click overdue task -> mo Task Detail Modal
- Activity feed: max 20 items, nut "Xem them"
- Mau sac: TODO=gray, IN_PROGRESS=blue, DONE=green
