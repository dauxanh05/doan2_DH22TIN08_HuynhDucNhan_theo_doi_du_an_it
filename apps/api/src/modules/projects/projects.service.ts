import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Tao project moi trong workspace.
   * User da duoc verify la member qua ProjectRoleGuard.
   */
  async create(workspaceId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        workspaceId,
        name: dto.name,
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
      },
    });
  }

  /**
   * Lay danh sach projects trong workspace.
   * Kem theo so luong tasks de hien thi tren list.
   */
  async findAll(workspaceId: string) {
    const projects = await this.prisma.project.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => ({
      ...p,
      taskCount: p._count.tasks,
      _count: undefined,
    }));
  }

  /**
   * Lay chi tiet 1 project.
   * Include so luong tasks theo tung status.
   */
  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      ...project,
      taskCount: project._count.tasks,
      _count: undefined,
    };
  }

  /**
   * Cap nhat project.
   */
  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Xoa project + unlink tat ca attachment files tren disk.
   *
   * Prisma onDelete: Cascade se tu xoa tasks, assignees, checklists, attachments records.
   * Nhung file vat ly tren disk can unlink thu cong truoc khi delete.
   */
  async delete(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
        tasks: {
          select: {
            attachments: {
              select: { path: true },
            },
            subtasks: {
              select: {
                attachments: {
                  select: { path: true },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Thu thap tat ca attachment paths (tasks + subtasks)
    const filePaths: string[] = [];

    // Them project image vao danh sach can unlink
    if (project.image?.startsWith('/uploads/')) {
      filePaths.push(project.image);
    }

    for (const task of project.tasks) {
      for (const att of task.attachments) {
        filePaths.push(att.path);
      }
      for (const subtask of task.subtasks) {
        for (const att of subtask.attachments) {
          filePaths.push(att.path);
        }
      }
    }

    // Unlink files tren disk
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
    for (const filePath of filePaths) {
      try {
        const fullPath = path.resolve(uploadDir, filePath.replace(/^\/uploads\//, ''));
        // Bao ve khoi path traversal
        if (fullPath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch {
        // Log nhung khong throw — file co the da bi xoa thu cong
      }
    }

    // Cascade delete project + tasks + subtasks + assignees + checklists + attachments
    await this.prisma.project.delete({ where: { id } });

    return { message: 'Project deleted successfully' };
  }

  /**
   * Upload anh dai dien cho project.
   * Neu project da co anh cu (luu tren server), xoa file tren disk truoc.
   * Bam pattern workspacesService.uploadLogo().
   */
  async uploadImage(id: string, file: Express.Multer.File) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Xoa anh cu tren disk neu la file da upload (bat dau bang /uploads/)
    if (project.image?.startsWith('/uploads/')) {
      const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
      const relPath = project.image.slice('/uploads/'.length);
      const oldPath = path.resolve(uploadDir, relPath);

      if (oldPath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imagePath = `/uploads/projects/${file.filename}`;

    await this.prisma.project.update({
      where: { id },
      data: { image: imagePath },
    });

    return { image: imagePath };
  }

  /**
   * Thong ke project: tong tasks, breakdown theo status, % hoan thanh.
   */
  async getStats(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Chi dem tasks chinh (parentId === null), khong dem subtasks
    const [total, todo, inProgress, done] = await Promise.all([
      this.prisma.task.count({ where: { projectId: id, parentId: null } }),
      this.prisma.task.count({ where: { projectId: id, parentId: null, status: 'TODO' } }),
      this.prisma.task.count({ where: { projectId: id, parentId: null, status: 'IN_PROGRESS' } }),
      this.prisma.task.count({ where: { projectId: id, parentId: null, status: 'DONE' } }),
    ]);

    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      done,
      percentage,
    };
  }
}
