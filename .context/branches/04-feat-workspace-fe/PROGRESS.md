# 04-feat-workspace-fe - Progress

> **Trang thai:** ALL PHASES DONE
> **Cap nhat:** 2026-03-08

## Tien do

### Phase 1: Store + Hooks — DONE

**Store (1 file modified):**
- [x] `workspace.store.ts` — persist middleware, expand Workspace interface (plan, createdAt, updatedAt), switchWorkspace, clearWorkspaces

**Query Hooks (3 files created):**
- [x] `useWorkspaces.ts` — GET /workspaces, sync store
- [x] `useWorkspace.ts` — GET /workspaces/:id
- [x] `useWorkspaceMembers.ts` — GET /workspaces/:id/members

**Mutation Hooks (7 files created):**
- [x] `useCreateWorkspace.ts` — POST /workspaces
- [x] `useUpdateWorkspace.ts` — PATCH /workspaces/:id
- [x] `useDeleteWorkspace.ts` — DELETE /workspaces/:id
- [x] `useInviteMember.ts` — POST /workspaces/:id/invite
- [x] `useRemoveMember.ts` — DELETE /workspaces/:id/members/:userId
- [x] `useUpdateMemberRole.ts` — PATCH /workspaces/:id/members/:userId
- [x] `useJoinWorkspace.ts` — POST /workspaces/join/:token

**Verification:** `tsc --noEmit` pass

### Phase 2: Pages — DONE

**Pages (4 files created):**
- [x] `WorkspaceListPage.tsx` — grid cards, skeleton loading, empty state, role badges, showCreate state
- [x] `WorkspaceSettingsPage.tsx` — form (name/slug/logo) + zod validation, inline delete confirm (type workspace name), OWNER-only danger zone
- [x] `MembersPage.tsx` — members list, custom role dropdown (click-outside), remove member, showInvite state
- [x] `JoinInvitationPage.tsx` — standalone page, 3 cases: auto-join (auth), login/register redirect (unauth), error state

**Verification:** `tsc --noEmit` pass

### Phase 3: Components + Routing — DONE

**Components (3 files created):**
- [x] `WorkspaceSwitcher.tsx` — dropdown component, click-outside-to-close, workspace list + role badges, "Tao workspace moi" link
- [x] `CreateWorkspaceModal.tsx` — modal overlay, react-hook-form + zod, slug auto-gen tu name, wired vao WorkspaceListPage
- [x] `InviteMemberModal.tsx` — modal overlay, email + role dropdown (ADMIN/MEMBER/VIEWER), wired vao MembersPage

**Modified files (2 files):**
- [x] `Sidebar.tsx` — import + render WorkspaceSwitcher giua Logo va Navigation
- [x] `App.tsx` — import 4 workspace pages, them route /invite/:token (standalone), them 3 protected routes (/workspaces, /workspaces/:id/settings, /workspaces/:id/members)

**Wiring (2 integrations):**
- [x] WorkspaceListPage ← CreateWorkspaceModal
- [x] MembersPage ← InviteMemberModal

**Verification:** `tsc --noEmit` pass
