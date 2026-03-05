# 14-feat-polish - Context

> **Loai:** feat | **Phu thuoc:** 13-feat-dashboard-fe

## Reference
- `context/overview.md` - Tong quan du an
- Tat ca context files - De review UX toan bo app

## Scope

Polish toan bo app: error handling, loading states, empty states, responsive design.

### Error Handling
- Global error boundary (React)
- Toast notifications (success, error, warning)
- API error handling thong nhat (axios interceptor)
- 404 page
- Form validation error messages

### Loading States
- Skeleton loading cho danh sach (projects, tasks, members)
- Skeleton loading cho dashboard widgets
- Button loading state khi submit
- Page loading (spinner hoac skeleton)

### Empty States
- Workspace rong (chua co project)
- Project rong (chua co task)
- Kanban column rong
- Notifications rong
- Comments rong
- Dashboard khong co du lieu

### Responsive Design
- Mobile-friendly layout
- Sidebar collapse tren mobile
- Kanban horizontal scroll tren mobile
- Dashboard 1 column tren mobile
- Touch-friendly buttons va inputs

### UX Improvements
- Keyboard shortcuts (Escape dong modal, Enter submit form)
- Confirmation dialogs cho delete actions
- Breadcrumb navigation
- Page titles (document.title)

## Rules
- Khong thay doi logic, chi them UX/UI polish
- Test tren mobile (responsive)
- Dark mode phai hoat dong voi tat ca components moi
