# Project State

## Project Reference

See: .context/PROJECT.md
**Core value:** UX/UI xuat sac + AI features tich hop
**Current focus:** Phase 5 (Comments & Real-time) — code xong, cho integration commit

## Current Position

Phase: 5 of 7 (Comments & Real-time) — IN PROGRESS
Branch: `main` (code truc tiep tren main)
Status: FE + BE viet xong, chua integration commit
Last activity: 2026-03-15 — Phase 5 FE components + hooks
Progress: [################____] 80%

## What's Done (Summary)

**Phase 1** (AUTH): 13 endpoints BE + FE auth flows — DONE
**Phase 2** (WS): 10 endpoints BE + FE workspace/team — DONE

**Phase 3 BE** (branch 05):
- Project module: CRUD + stats (6 endpoints)
- Task module: CRUD + reorder, subtasks, assignees (9+ endpoints)
- Sub-features: checklist CRUD, file attachments upload/delete

**Phase 3 FE** (branch 06):
- 5 hooks: useProjects, useProject, useTasks, useTask + mutations
- 2 pages: ProjectListPage, ProjectDetailPage
- TaskDetailModal + SubtaskList + ChecklistSection + AttachmentSection

**Phase 3 AI** (branch 07):
- AI module: 4 endpoints (split-task, analyze-progress, suggest-assignee, code-assist)

**Phase 4** (branch 09):
- Kanban Board: KanbanPage, KanbanColumn, TaskCard, drag-drop, filter, quick add
- KAN-01..07 DONE

**Phase 5 BE** (branch 10):
- Comments module: 4 endpoints CRUD (GET/POST/PATCH/DELETE)
- Notifications module: 4 endpoints + unread-count
- WebSocket Gateway: Socket.io + JWT auth, room management, emit events

**Phase 5 FE** (main):
- socket.ts singleton + useSocket hook (connect/disconnect/cache invalidation)
- CommentSection + MentionInput (@mention autocomplete, highlight, edit/delete)
- NotificationBell + NotificationDropdown (real-time badge, mark read/all)
- 8 hooks: useComments, useCreateComment, useUpdateComment, useDeleteComment,
  useNotifications, useUnreadCount, useMarkRead, useMarkAllRead
- Build: tsc --noEmit pass + vite build pass

## What's Next

1. Integration commit Phase 5 (BE + FE)
2. Phase 6: Dashboard (branch 12-feat-dashboard-be + 13-feat-dashboard-fe)

## Blockers/Concerns

- Phase 5 chua co integration commit — can test manual sau khi merge BE

## Known Warnings (non-blocking)

- invite het han van chan re-invite (check duplicate ko xet expiresAt)
- slug race condition chua map Prisma P2002

## Accumulated Decisions

- Context restructured to `.context/` with GSD concepts (2026-02-27)
- Google OAuth + Email features: lam luon trong MVP (2026-02-15)
- Refresh token: Database + Cookie (2026-02-15)
- 4 AI Features tich hop vao MVP (2026-02-15)
- Auth hardening: NestJS CacheModule cho Google one-time code exchange (2026-03-06)
- Workspace BE before FE, sequential merge flow (2026-03-08)
- Email-bound invite validation: joinByToken check user email match invitation (2026-03-08)
- Phase 5 code tren main (khong tach branch rieng cho FE)

## Session Log

### 2026-03-08

- Branch 03 BE + 04 FE: workspace + team, 10 endpoints
- Phase 2 DONE — WS-01..WS-14 all checked

### 2026-03-14

- Phase 3 commit vao main: branches 05 + 06 + 07 merged
- PROJ-01..07, TASK-01..11, AI-01..06 all checked [x]
- Phase 3 DONE — Phase 4 Kanban next

### 2026-03-15

- Phase 4 DONE: KAN-01..07 [x], Kanban board merge vao main
- Phase 5: BE (comments + notifications + WS gateway) code xong
- Phase 5 FE: 13 files moi (socket, 8 hooks, 4 components), 3 files sua
- RT-01..10 [~] — cho integration commit + manual test

---

*This file must stay under 100 lines. Move old entries to archive when needed.*
*Last updated: 2026-03-15*
