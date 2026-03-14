import {
  Controller,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ProjectRoleGuard } from '@/common/guards/project-role.guard';
import { WorkspaceRoles } from '@/common/decorators/workspace-roles.decorator';
import { ResolveWorkspaceFrom } from '@/common/decorators/resolve-workspace.decorator';
import { FilesService } from './files.service';

/** Max file size: 10MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

@ApiTags('Files')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('tasks/:id/attachments')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload file attachment cho task' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  @ApiResponse({ status: 400, description: 'File too large or invalid' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || './uploads';
          cb(null, `${uploadDir}/attachments`);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        // Block executable files
        const blockedExts = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.dll'];
        const ext = extname(file.originalname).toLowerCase();
        if (blockedExts.includes(ext)) {
          cb(new BadRequestException('File type not allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadAttachment(
    @Param('id') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please select a file to upload');
    }
    return this.filesService.createAttachment(taskId, file);
  }

  @Delete('attachments/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('attachmentId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xoa attachment' })
  @ApiResponse({ status: 200, description: 'Attachment deleted' })
  async deleteAttachment(@Param('id') id: string) {
    return this.filesService.deleteAttachment(id);
  }
}
