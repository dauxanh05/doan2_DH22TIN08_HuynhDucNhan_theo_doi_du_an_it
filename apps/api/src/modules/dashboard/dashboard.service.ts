import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(workspaceId: string) {
    const [projectsProgress, tasksByStatus, overdueTasks, memberWorkload] =
      await Promise.all([
        this.getProjectsProgress(workspaceId),
        this.getTasksByStatus(workspaceId),
        this.getOverdueTasks(workspaceId),
        this.getMemberWorkload(workspaceId),
      ]);

    return { projectsProgress, tasksByStatus, overdueTasks, memberWorkload };
  }

  async getActivity(workspaceId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { workspaceId },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activity.count({ where: { workspaceId } }),
    ]);

    const transformed = data.map((item) => ({
      id: item.id,
      userId: item.userId,
      userName: item.user.name,
      action: item.action,
      entityType: item.entityType,
      entityId: item.entityId,
      entityName:
        (item.metadata as Record<string, string> | null)?.entityName ??
        item.entityId,
      createdAt: item.createdAt,
    }));

    return { data: transformed, total, page, limit };
  }

  // ------- Private helpers -------

  private async getProjectsProgress(workspaceId: string) {
    const projects = await this.prisma.project.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        color: true,
        tasks: {
          where: { parentId: null },
          select: { status: true },
        },
      },
    });

    return projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;
      const percentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        projectId: project.id,
        name: project.name,
        color: project.color,
        totalTasks,
        completedTasks,
        percentage,
      };
    });
  }

  private async getTasksByStatus(workspaceId: string) {
    const groups = await this.prisma.task.groupBy({
      by: ['status'],
      where: { parentId: null, project: { workspaceId } },
      _count: true,
    });

    const result: Record<string, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };

    for (const group of groups) {
      result[group.status] = group._count;
    }

    return result;
  }

  private async getOverdueTasks(workspaceId: string) {
    const now = new Date();

    const tasks = await this.prisma.task.findMany({
      where: {
        parentId: null,
        status: { not: TaskStatus.DONE },
        dueDate: { lt: now },
        project: { workspaceId },
      },
      include: {
        project: { select: { name: true } },
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    return tasks
      .map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        projectName: task.project.name,
        daysOverdue: Math.ceil(
          (now.getTime() - task.dueDate!.getTime()) / 86400000,
        ),
        assignees: task.assignees.map((a) => a.user),
      }))
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  private async getMemberWorkload(workspaceId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    const workload = await Promise.all(
      members.map(async (member) => {
        const [activeTasks, completedTasks] = await Promise.all([
          this.prisma.taskAssignee.count({
            where: {
              userId: member.userId,
              task: {
                parentId: null,
                status: { not: TaskStatus.DONE },
                project: { workspaceId },
              },
            },
          }),
          this.prisma.taskAssignee.count({
            where: {
              userId: member.userId,
              task: {
                parentId: null,
                status: TaskStatus.DONE,
                project: { workspaceId },
              },
            },
          }),
        ]);

        return {
          userId: member.userId,
          name: member.user.name,
          activeTasks,
          completedTasks,
        };
      }),
    );

    return workload.sort((a, b) => b.activeTasks - a.activeTasks);
  }
}
