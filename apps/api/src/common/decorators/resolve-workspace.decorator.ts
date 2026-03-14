import { SetMetadata } from '@nestjs/common';

/**
 * RESOLVE_WORKSPACE_KEY
 *
 * Metadata key cho ProjectRoleGuard.
 * Chi dinh cach resolve workspaceId tu request params.
 */
export const RESOLVE_WORKSPACE_KEY = 'resolve-workspace';

/**
 * Cac kieu resolve workspaceId
 *
 * - 'workspaceId': lay truc tiep tu params.workspaceId
 * - 'projectId':   query DB: project.workspaceId
 * - 'taskId':      query DB: task.project.workspaceId (params.id la taskId)
 * - 'checklistId': query DB: checklist.task.project.workspaceId (params.id la checklistId)
 * - 'attachmentId': query DB: attachment.task.project.workspaceId (params.id la attachmentId)
 */
export type ResolveType =
  | 'workspaceId'
  | 'projectId'
  | 'taskId'
  | 'checklistId'
  | 'attachmentId';

/**
 * ResolveWorkspaceFrom Decorator
 *
 * Cho ProjectRoleGuard biet cach resolve workspaceId tu route params.
 *
 * Usage:
 *   @ResolveWorkspaceFrom('workspaceId')  // params.workspaceId co san
 *   @ResolveWorkspaceFrom('projectId')    // params.projectId -> query Project
 *   @ResolveWorkspaceFrom('taskId')       // params.id la taskId -> query Task -> Project
 *
 *   @UseGuards(JwtAuthGuard, ProjectRoleGuard)
 *   @ResolveWorkspaceFrom('projectId')
 *   @Get(':projectId/tasks')
 *   findTasks() { ... }
 */
export const ResolveWorkspaceFrom = (type: ResolveType) =>
  SetMetadata(RESOLVE_WORKSPACE_KEY, type);
