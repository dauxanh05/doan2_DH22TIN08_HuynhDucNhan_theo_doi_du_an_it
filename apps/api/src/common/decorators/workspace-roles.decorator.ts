import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const WORKSPACE_ROLES_KEY = 'workspace-roles';

/**
 * WorkspaceRoles Decorator
 *
 * Specify which roles are allowed for a route.
 * Used together with WorkspaceRoleGuard.
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard, WorkspaceRoleGuard)
 *   @WorkspaceRoles(Role.OWNER, Role.ADMIN)
 *   @Patch(':id')
 *   update() { ... }
 *
 * If not applied, WorkspaceRoleGuard only checks membership (any role allowed).
 */
export const WorkspaceRoles = (...roles: Role[]) => SetMetadata(WORKSPACE_ROLES_KEY, roles);
