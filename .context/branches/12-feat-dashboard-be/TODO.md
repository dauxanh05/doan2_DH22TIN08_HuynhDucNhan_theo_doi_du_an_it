# 12-feat-dashboard-be - TODO

## Dashboard Module (hoac mo rong Workspaces)
- [ ] Quyet dinh: tao module rieng hay them vao workspaces
- [ ] Dashboard stats endpoint
- [ ] Activity feed endpoint

## Stats Logic
- [ ] projectsProgress - tinh % tasks DONE / total tasks moi project
- [ ] tasksByStatus - dem tasks theo TODO, IN_PROGRESS, DONE
- [ ] overdueTasks - loc tasks co dueDate < today va status != DONE
- [ ] memberWorkload - dem active tasks (status != DONE) moi member

## Activity Feed
- [ ] Quyet dinh: them bang Activity trong DB hay generate tu events
- [ ] Implement activity logging
- [ ] Paginated query (page, limit)

## Test manual
- [ ] Test stats endpoint voi workspace co du lieu
- [ ] Test projectsProgress tinh dung %
- [ ] Test overdueTasks loc dung
- [ ] Test memberWorkload dem dung
- [ ] Test activity feed pagination
