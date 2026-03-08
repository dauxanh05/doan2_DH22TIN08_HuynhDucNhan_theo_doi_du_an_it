import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { WORKSPACE_ROLES_KEY } from '../decorators/workspace-roles.decorator';

/**
 * WorkspaceRoleGuard
 *
 * Checks that the current user is a member of the workspace (from :id param).
 * Optionally checks if the member has one of the required roles.
 *
 * MUST be used AFTER JwtAuthGuard:
 *   @UseGuards(JwtAuthGuard, WorkspaceRoleGuard)
 *
 * Attaches the workspace member to request.workspaceMember for downstream use.
 */
@Injectable()
export class WorkspaceRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const workspaceId = request.params.id;
    const userId = request.user.id;

    // Check membership
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });

    if (!member) {
      throw new ForbiddenException('Not a member of this workspace');
    }

    // Check required roles (if @WorkspaceRoles() is applied)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(WORKSPACE_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && !requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Attach member to request for downstream use
    request.workspaceMember = member;

    return true;
  }
}
