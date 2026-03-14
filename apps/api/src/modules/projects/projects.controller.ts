import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
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
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { WorkspaceRoles } from '@/common/decorators/workspace-roles.decorator';
import { ResolveWorkspaceFrom } from '@/common/decorators/resolve-workspace.decorator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/** Max file size cho project image: 5MB */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

@ApiTags('Projects')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // ============================================================
  // Routes nested under /workspaces/:workspaceId/projects
  // ============================================================

  @Post('workspaces/:workspaceId/projects')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('workspaceId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tao project moi trong workspace' })
  @ApiResponse({ status: 201, description: 'Project created' })
  async create(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(workspaceId, dto);
  }

  @Get('workspaces/:workspaceId/projects')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('workspaceId')
  @ApiOperation({ summary: 'Lay danh sach projects trong workspace' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  async findAll(@Param('workspaceId') workspaceId: string) {
    return this.projectsService.findAll(workspaceId);
  }

  // ============================================================
  // Routes under /projects/:id
  // ============================================================

  @Get('projects/:id/stats')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @ApiOperation({ summary: 'Lay thong ke project' })
  @ApiResponse({ status: 200, description: 'Project stats' })
  async getStats(@Param('id') id: string) {
    return this.projectsService.getStats(id);
  }

  @Get('projects/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @ApiOperation({ summary: 'Lay chi tiet project' })
  @ApiResponse({ status: 200, description: 'Project details' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  // === STATIC /image ROUTE TRUOC dynamic :id ===

  @Patch('projects/:id/image')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Upload anh dai dien project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size exceeds 5MB' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || './uploads';
          cb(null, `${uploadDir}/projects`);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Chi chap nhan file anh (jpg, png, gif, webp)'), false);
        }
      },
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui long chon file anh');
    }
    return this.projectsService.uploadImage(id, file);
  }

  @Patch('projects/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cap nhat project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete('projects/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Xoa project' })
  @ApiResponse({ status: 200, description: 'Project deleted' })
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
