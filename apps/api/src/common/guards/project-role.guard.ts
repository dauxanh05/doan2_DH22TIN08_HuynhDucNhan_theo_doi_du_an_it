import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { WORKSPACE_ROLES_KEY } from '../decorators/workspace-roles.decorator';
import { RESOLVE_WORKSPACE_KEY, ResolveType } from '../decorators/resolve-workspace.decorator';

/**
 * ProjectRoleGuard
 *
 * Guard linh hoat hon WorkspaceRoleGuard.
 * Resolve workspaceId tu nhieu loai params khac nhau (project, task, checklist, attachment).
 *
 * MUST be used AFTER JwtAuthGuard:
 *   @UseGuards(JwtAuthGuard, ProjectRoleGuard)
 *
 * MUST pair with @ResolveWorkspaceFrom() decorator:
 *   @ResolveWorkspaceFrom('projectId')
 *   @UseGuards(JwtAuthGuard, ProjectRoleGuard)
 *
 * Attaches request.workspaceMember for downstream use.
 */
@Injectable()
export class ProjectRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    // 1. Xac dinh cach resolve workspaceId
    const resolveType = this.reflector.getAllAndOverride<ResolveType>(RESOLVE_WORKSPACE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!resolveType) {
      throw new Error('ProjectRoleGuard requires @ResolveWorkspaceFrom() decorator');
    }

    // 2. Resolve workspaceId tu params
    const workspaceId = await this.resolveWorkspaceId(resolveType, request.params);

    // 3. Check membership
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });

    if (!member) {
      throw new ForbiddenException('Not a member of this workspace');
    }

    // 4. Check required roles (if @WorkspaceRoles() is applied)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(WORKSPACE_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && !requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // 5. Attach member to request for downstream use
    request.workspaceMember = member;

    return true;
  }

  /**
   * Resolve workspaceId tu request params dua tren resolveType.
   *
   * - workspaceId:   params.workspaceId truc tiep
   * - projectId:     params.projectId || params.id → query Project
   * - taskId:        params.id → query Task → Project
   * - checklistId:   params.id → query ChecklistItem → Task → Project
   * - attachmentId:  params.id → query Attachment → Task → Project
   */
  private async resolveWorkspaceId(
    type: ResolveType,
    params: Record<string, string>,
  ): Promise<string> {
    switch (type) {
      case 'workspaceId': {
        const workspaceId = params.workspaceId;
        if (!workspaceId) {
          throw new NotFoundException('Workspace ID is required');
        }
        return workspaceId;
      }

      case 'projectId': {
        const projectId = params.projectId || params.id;
        if (!projectId) {
          throw new NotFoundException('Project ID is required');
        }
        const project = await this.prisma.project.findUnique({
          where: { id: projectId },
          select: { workspaceId: true },
        });
        if (!project) {
          throw new NotFoundException('Project not found');
        }
        return project.workspaceId;
      }

      case 'taskId': {
        const taskId = params.id;
        if (!taskId) {
          throw new NotFoundException('Task ID is required');
        }
        const task = await this.prisma.task.findUnique({
          where: { id: taskId },
          select: { project: { select: { workspaceId: true } } },
        });
        if (!task) {
          throw new NotFoundException('Task not found');
        }
        return task.project.workspaceId;
      }

      case 'checklistId': {
        const checklistId = params.id;
        if (!checklistId) {
          throw new NotFoundException('Checklist ID is required');
        }
        const item = await this.prisma.checklistItem.findUnique({
          where: { id: checklistId },
          select: { task: { select: { project: { select: { workspaceId: true } } } } },
        });
        if (!item) {
          throw new NotFoundException('Checklist item not found');
        }
        return item.task.project.workspaceId;
      }

      case 'attachmentId': {
        const attachmentId = params.id;
        if (!attachmentId) {
          throw new NotFoundException('Attachment ID is required');
        }
        const attachment = await this.prisma.attachment.findUnique({
          where: { id: attachmentId },
          select: { task: { select: { project: { select: { workspaceId: true } } } } },
        });
        if (!attachment) {
          throw new NotFoundException('Attachment not found');
        }
        return attachment.task.project.workspaceId;
      }

      default:
        throw new Error(`Unknown resolve type: ${type}`);
    }
  }
}
