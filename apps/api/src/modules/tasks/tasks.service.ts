import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // ============================================================
  // Task CRUD
  // ============================================================

  /**
   * Tao task moi trong project.
   * Position = max position hien tai + 1.
   */
  async create(projectId: string, dto: CreateTaskDto) {
    // Tim position lon nhat trong cung project + cung status
    const maxPositionTask = await this.prisma.task.findFirst({
      where: { projectId, parentId: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const position = maxPositionTask ? maxPositionTask.position + 1 : 0;

    const createdTask = await this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position,
      },
    });

    // Fire-and-forget: emit WebSocket event
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        select: { workspaceId: true },
      });
      if (project) {
        this.notificationsGateway.emitToWorkspace(
          project.workspaceId,
          'task_created',
          createdTask,
        );
      }
    } catch (error) {
      console.error('[TasksService] WS emit task_created error:', error);
    }

    return createdTask;
  }

  /**
   * Lay danh sach tasks trong project.
   * Filter theo status, priority. Sort theo position.
   * Chi lay tasks chinh (parentId === null), include subtasks count.
   */
  async findAll(
    projectId: string,
    filters?: { status?: TaskStatus; priority?: string },
  ) {
    const where: Record<string, unknown> = {
      projectId,
      parentId: null, // Chi lay top-level tasks
    };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        assignees: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        _count: {
          select: { subtasks: true, checklists: true, attachments: true },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Lay chi tiet 1 task.
   * Include subtasks, assignees, checklists, attachments.
   */
  async findById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: {
          include: {
            assignees: {
              include: {
                user: {
                  select: { id: true, name: true, avatar: true },
                },
              },
            },
            _count: {
              select: { checklists: true, attachments: true },
            },
          },
          orderBy: { position: 'asc' },
        },
        assignees: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        checklists: {
          orderBy: { position: 'asc' },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  /**
   * Cap nhat task.
   * Handle completedAt tu dong:
   *   - Chuyen sang DONE → completedAt = now()
   *   - Chuyen khoi DONE → completedAt = null
   */
  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Build update data
    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.priority !== undefined) data.priority = dto.priority;
    if (dto.dueDate !== undefined) data.dueDate = new Date(dto.dueDate);

    // Handle completedAt logic khi status thay doi
    if (dto.status !== undefined) {
      data.status = dto.status;
      if (dto.status === 'DONE' && task.status !== 'DONE') {
        data.completedAt = new Date();
      } else if (dto.status !== 'DONE' && task.status === 'DONE') {
        data.completedAt = null;
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
    });

    // Fire-and-forget: emit WebSocket event
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: updatedTask.projectId },
        select: { workspaceId: true },
      });
      if (project) {
        this.notificationsGateway.emitToWorkspace(
          project.workspaceId,
          'task_updated',
          updatedTask,
        );
      }
    } catch (error) {
      console.error('[TasksService] WS emit task_updated error:', error);
    }

    return updatedTask;
  }

  /**
   * Xoa task + unlink attachment files.
   * Cascade delete subtasks, assignees, checklists, attachments records.
   */
  async delete(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        attachments: { select: { path: true } },
        subtasks: {
          select: {
            attachments: { select: { path: true } },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Query workspaceId TRUOC khi xoa
    let workspaceId: string | null = null;
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: task.projectId },
        select: { workspaceId: true },
      });
      if (project) {
        workspaceId = project.workspaceId;
      }
    } catch (error) {
      console.error('[TasksService] Query workspaceId for delete error:', error);
    }

    // Thu thap tat ca attachment paths
    const filePaths: string[] = [];
    for (const att of task.attachments) {
      filePaths.push(att.path);
    }
    for (const subtask of task.subtasks) {
      for (const att of subtask.attachments) {
        filePaths.push(att.path);
      }
    }

    // Unlink files tren disk
    this.unlinkFiles(filePaths);

    await this.prisma.task.delete({ where: { id } });

    // Fire-and-forget: emit WebSocket event SAU khi xoa
    try {
      if (workspaceId) {
        this.notificationsGateway.emitToWorkspace(
          workspaceId,
          'task_deleted',
          { taskId: id },
        );
      }
    } catch (error) {
      console.error('[TasksService] WS emit task_deleted error:', error);
    }

    return { message: 'Task deleted successfully' };
  }

  /**
   * Reorder tasks — update batch positions trong 1 transaction.
   * Frontend gui array [{id, position}].
   */
  async reorder(dto: ReorderTasksDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.task.update({
          where: { id: item.id },
          data: { position: item.position },
        }),
      ),
    );

    return { message: 'Tasks reordered successfully' };
  }

  // ============================================================
  // Subtasks
  // ============================================================

  /**
   * Tao subtask.
   * Max 2 levels: task -> subtask. Subtask khong the co subtask.
   */
  async createSubtask(parentId: string, dto: CreateTaskDto) {
    const parent = await this.prisma.task.findUnique({
      where: { id: parentId },
      select: { parentId: true, projectId: true },
    });

    if (!parent) {
      throw new NotFoundException('Parent task not found');
    }

    // Check depth: neu parent da la subtask (co parentId) → khong cho tao
    if (parent.parentId !== null) {
      throw new BadRequestException('Maximum subtask depth is 2 levels');
    }

    // Position = max position cua subtasks hien tai + 1
    const maxPositionSubtask = await this.prisma.task.findFirst({
      where: { parentId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const position = maxPositionSubtask ? maxPositionSubtask.position + 1 : 0;

    return this.prisma.task.create({
      data: {
        projectId: parent.projectId,
        parentId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position,
      },
    });
  }

  // ============================================================
  // Assignees
  // ============================================================

  /**
   * Assign user vao task.
   * Check: user phai la member cua workspace (qua project).
   */
  async assignUser(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { project: { select: { workspaceId: true } } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check user la workspace member
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: task.project.workspaceId,
        },
      },
    });

    if (!member) {
      throw new BadRequestException('User is not a workspace member');
    }

    // Check chua assign
    const existing = await this.prisma.taskAssignee.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });

    if (existing) {
      throw new ConflictException('User already assigned to this task');
    }

    await this.prisma.taskAssignee.create({
      data: { taskId, userId },
    });

    return { message: 'User assigned successfully' };
  }

  /**
   * Unassign user khoi task.
   */
  async unassignUser(taskId: string, userId: string) {
    const assignee = await this.prisma.taskAssignee.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });

    if (!assignee) {
      throw new NotFoundException('User is not assigned to this task');
    }

    await this.prisma.taskAssignee.delete({
      where: { taskId_userId: { taskId, userId } },
    });

    return { message: 'User unassigned successfully' };
  }

  // ============================================================
  // Checklists
  // ============================================================

  /**
   * Lay danh sach checklist items cua task.
   */
  async getChecklists(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.checklistItem.findMany({
      where: { taskId },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Them checklist item vao task.
   */
  async createChecklistItem(taskId: string, dto: CreateChecklistItemDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Position = max + 1
    const maxPositionItem = await this.prisma.checklistItem.findFirst({
      where: { taskId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const position = maxPositionItem ? maxPositionItem.position + 1 : 0;

    return this.prisma.checklistItem.create({
      data: {
        taskId,
        title: dto.title,
        position,
      },
    });
  }

  /**
   * Cap nhat checklist item (title, completed toggle).
   */
  async updateChecklistItem(id: string, dto: UpdateChecklistItemDto) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    return this.prisma.checklistItem.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Xoa checklist item.
   */
  async deleteChecklistItem(id: string) {
    const item = await this.prisma.checklistItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    await this.prisma.checklistItem.delete({ where: { id } });

    return { message: 'Checklist item deleted successfully' };
  }

  // ============================================================
  // Private helpers
  // ============================================================

  /**
   * Unlink files tren disk. An toan — khong throw neu file khong ton tai.
   */
  private unlinkFiles(filePaths: string[]) {
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');

    for (const filePath of filePaths) {
      try {
        const fullPath = path.resolve(uploadDir, filePath.replace(/^\/uploads\//, ''));
        if (fullPath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // Skip — file co the da bi xoa thu cong
      }
    }
  }
}
