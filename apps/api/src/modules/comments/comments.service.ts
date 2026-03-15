import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async findAll(taskId: string) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(taskId: string, userId: string, dto: CreateCommentDto) {
    // Validate task tồn tại
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task ${taskId} không tồn tại`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        userId,
        content: dto.content,
        mentions: dto.mentions ?? [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Fire-and-forget: notifications + WebSocket
    try {
      // Query task with project relation de lay workspaceId + assignees
      const taskWithProject = await this.prisma.task.findUnique({
        where: { id: taskId },
        include: {
          project: { select: { workspaceId: true } },
          assignees: { select: { userId: true } },
        },
      });

      if (taskWithProject?.project) {
        // Emit comment_added to workspace
        this.notificationsGateway.emitToWorkspace(
          taskWithProject.project.workspaceId,
          'comment_added',
          comment,
        );
      }

      // Tao mention notifications
      if (dto.mentions && dto.mentions.length > 0) {
        const mentionNotifs = await this.notificationsService.createMention(
          dto.mentions,
          task.title,
          comment.user.name,
          taskId,
        );
        for (const notif of mentionNotifs) {
          this.notificationsGateway.emitToUser(
            notif.userId,
            'notification',
            notif,
          );
        }
      }

      // Tao COMMENT_ADDED notification cho assignees (tru nguoi comment + nguoi da mention)
      if (taskWithProject?.assignees) {
        const mentionSet = new Set(dto.mentions ?? []);
        const assigneesToNotify = taskWithProject.assignees
          .map((a) => a.userId)
          .filter((id) => id !== userId && !mentionSet.has(id));

        for (const assigneeId of assigneesToNotify) {
          const notif = await this.notificationsService.create({
            userId: assigneeId,
            type: NotificationType.COMMENT_ADDED,
            title: `${comment.user.name} đã bình luận`,
            message: `Trong task "${task.title}"`,
            data: { taskId },
          });
          this.notificationsGateway.emitToUser(
            assigneeId,
            'notification',
            notif,
          );
        }
      }
    } catch (error) {
      console.error('[CommentsService] Notification/WS error:', error);
    }

    return comment;
  }

  async update(id: string, userId: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment ${id} không tồn tại`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa comment này');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comment ${id} không tồn tại`);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa comment này');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Xóa comment thành công' };
  }
}
