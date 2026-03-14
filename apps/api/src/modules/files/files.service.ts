import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Luu attachment record vao DB sau khi multer da upload file.
   */
  async createAttachment(taskId: string, file: Express.Multer.File) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const filePath = `/uploads/attachments/${file.filename}`;

    return this.prisma.attachment.create({
      data: {
        taskId,
        filename: file.originalname,
        path: filePath,
        mimetype: file.mimetype,
        size: file.size,
      },
    });
  }

  /**
   * Xoa attachment: xoa file tren disk + xoa record DB.
   */
  async deleteAttachment(id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    // Unlink file tren disk
    const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
    try {
      const fullPath = path.resolve(
        uploadDir,
        attachment.path.replace(/^\/uploads\//, ''),
      );
      // Bao ve khoi path traversal
      if (fullPath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch {
      // File co the da bi xoa thu cong — tiep tuc xoa record
    }

    await this.prisma.attachment.delete({ where: { id } });

    return { message: 'Attachment deleted successfully' };
  }
}
