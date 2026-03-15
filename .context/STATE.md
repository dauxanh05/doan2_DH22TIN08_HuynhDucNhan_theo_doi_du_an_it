# Project State

## Project Reference

See: .context/PROJECT.md
**Core value:** UX/UI xuat sac + AI features tich hop
**Current focus:** Phase 6 (Dashboard) — code xong, cho manual test + verification

## Current Position

Phase: 6 of 7 (Dashboard & Reports) — IN PROGRESS
Branch: `main` (code truc tiep tren main)
Status: Phase 5 commit + push xong, Dashboard BE + FE code xong, local validation pass, cho manual test
Last activity: 2026-03-15 — push Phase 5 + Dashboard commit len origin
Progress: [#################___] 85%

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

1. Manual test Dashboard + Comments + Notifications + Realtime
2. Verify RT-01..10 va DASH-01..07 de cap nhat REQUIREMENTS
3. Quyết định Phase tiep theo sau khi test xong

## Blockers/Concerns

- Chua co manual browser test cho Dashboard + Realtime sau 2 commit moi nhat

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
- Quy uoc chia tab theo do kho/model: task binh thuong → Sonnet 4.6, task kho/nhieu file → Opus 4.6

## Session Log

### 2026-03-08

- Branch 03 BE + 04 FE: workspace + team, 10 endpoints (archived)

### 2026-03-14

- Phase 3 merged to main; PROJ-01..07, TASK-01..11, AI-01..06 checked

### 2026-03-15

- Regression verification completed:
  - Frontend: tsc --noEmit passed.
  - Frontend build: vite build passed; only non-blocking "large chunk" warning observed.
  - Backend: tsc --noEmit passed.
  - Kanban: dnd-kit drag-drop + useSocket cache invalidation paths confirmed (WS events + local reorder flows).
  - Project image upload: FE PATCH flow + BE FileInterceptor (multer) handling confirmed end-to-end.
  - Code scan (scoped): no TODO/FIXME comments found (enum/status string matches ignored as false positives).
  - Router/sidebar: mismatches reported only — global /projects vs workspace-scoped project routes; user settings routes vs workspace settings links.
- No blockers; proceed to update ROADMAP/REQUIREMENTS if needed by test results.

---

*This file must stay under 100 lines. Move old entries to archive when needed.*
*Last updated: 2026-03-15*
