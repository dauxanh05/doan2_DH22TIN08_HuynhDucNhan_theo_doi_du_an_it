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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceRoleGuard } from '@/common/guards/workspace-role.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { WorkspaceRoles } from '@/common/decorators/workspace-roles.decorator';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('Workspaces')
@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'Workspace created' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user workspaces' })
  @ApiResponse({ status: 200, description: 'List of workspaces' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.workspacesService.findAllByUser(userId);
  }

  // === join/:token MUST be before :id routes ===

  @Post('join/:token')
  @ApiOperation({ summary: 'Join workspace via invitation link' })
  @ApiResponse({ status: 200, description: 'Joined workspace' })
  async joinByToken(
    @Param('token') token: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('email') userEmail: string,
  ) {
    return this.workspacesService.joinByToken(token, userId, userEmail);
  }

  // === :id routes ===

  @Get(':id')
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: 'Get workspace details' })
  @ApiResponse({ status: 200, description: 'Workspace details with members' })
  async findOne(@Param('id') id: string) {
    return this.workspacesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update workspace' })
  @ApiResponse({ status: 200, description: 'Workspace updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateWorkspaceDto) {
    return this.workspacesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER)
  @ApiOperation({ summary: 'Delete workspace' })
  @ApiResponse({ status: 200, description: 'Workspace deleted' })
  async delete(@Param('id') id: string) {
    return this.workspacesService.delete(id);
  }

  @Patch(':id/logo')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Upload workspace logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Logo uploaded' })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || './uploads';
          cb(null, `${uploadDir}/workspace-logos`);
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
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui long chon file anh');
    }
    return this.workspacesService.uploadLogo(id, file);
  }

  @Get(':id/members')
  @UseGuards(WorkspaceRoleGuard)
  @ApiOperation({ summary: 'List workspace members' })
  @ApiResponse({ status: 200, description: 'List of members' })
  async getMembers(@Param('id') id: string) {
    return this.workspacesService.getMembers(id);
  }

  @Post(':id/invite')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Invite member via email' })
  @ApiResponse({ status: 200, description: 'Invitation sent' })
  async inviteMember(
    @Param('id') id: string,
    @Body() dto: InviteMemberDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.workspacesService.inviteMember(id, dto, userId);
  }

  @Delete(':id/members/:userId')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Remove member from workspace' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  async removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.workspacesService.removeMember(id, userId);
  }

  @Patch(':id/members/:userId')
  @UseGuards(WorkspaceRoleGuard)
  @WorkspaceRoles(Role.OWNER, Role.ADMIN)
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.workspacesService.updateMemberRole(id, userId, dto);
  }
}
