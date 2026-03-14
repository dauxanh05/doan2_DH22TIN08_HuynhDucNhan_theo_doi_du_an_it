import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role, TaskStatus, Priority } from '@prisma/client';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ProjectRoleGuard } from '@/common/guards/project-role.guard';
import { WorkspaceRoles } from '@/common/decorators/workspace-roles.decorator';
import { ResolveWorkspaceFrom } from '@/common/decorators/resolve-workspace.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTasksDto } from './dto/reorder-tasks.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';
import { AssignUserDto } from './dto/assign-user.dto';

@ApiTags('Tasks')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // ============================================================
  // Routes nested under /projects/:projectId/tasks
  // ============================================================

  @Post('projects/:projectId/tasks')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tao task moi trong project' })
  @ApiResponse({ status: 201, description: 'Task created' })
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, dto);
  }

  @Get('projects/:projectId/tasks')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('projectId')
  @ApiOperation({ summary: 'Lay danh sach tasks trong project' })
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiQuery({ name: 'priority', enum: Priority, required: false })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  async findAll(
    @Param('projectId') projectId: string,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: string,
  ) {
    return this.tasksService.findAll(projectId, { status, priority });
  }

  // ============================================================
  // === STATIC ROUTES TRUOC — tranh bi :id bat nham ===
  // ============================================================

  @Patch('tasks/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sap xep lai tasks (drag-drop)' })
  @ApiResponse({ status: 200, description: 'Tasks reordered' })
  async reorder(@Body() dto: ReorderTasksDto) {
    return this.tasksService.reorder(dto);
  }

  // ============================================================
  // Routes under /tasks/:id
  // ============================================================

  @Get('tasks/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @ApiOperation({ summary: 'Lay chi tiet task' })
  @ApiResponse({ status: 200, description: 'Task details' })
  async findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch('tasks/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cap nhat task' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete('tasks/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xoa task' })
  @ApiResponse({ status: 200, description: 'Task deleted' })
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  // ============================================================
  // Subtasks
  // ============================================================

  @Post('tasks/:id/subtasks')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tao subtask' })
  @ApiResponse({ status: 201, description: 'Subtask created' })
  @ApiResponse({ status: 400, description: 'Maximum subtask depth is 2 levels' })
  async createSubtask(
    @Param('id') parentId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.createSubtask(parentId, dto);
  }

  // ============================================================
  // Assignees
  // ============================================================

  @Post('tasks/:id/assignees')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Assign user vao task' })
  @ApiResponse({ status: 201, description: 'User assigned' })
  @ApiResponse({ status: 400, description: 'User is not a workspace member' })
  async assignUser(
    @Param('id') taskId: string,
    @Body() dto: AssignUserDto,
  ) {
    return this.tasksService.assignUser(taskId, dto.userId);
  }

  @Delete('tasks/:id/assignees/:userId')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Unassign user khoi task' })
  @ApiResponse({ status: 200, description: 'User unassigned' })
  async unassignUser(
    @Param('id') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.tasksService.unassignUser(taskId, userId);
  }

  // ============================================================
  // Checklists
  // ============================================================

  @Get('tasks/:id/checklists')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @ApiOperation({ summary: 'Lay danh sach checklist items' })
  @ApiResponse({ status: 200, description: 'List of checklist items' })
  async getChecklists(@Param('id') taskId: string) {
    return this.tasksService.getChecklists(taskId);
  }

  @Post('tasks/:id/checklists')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('taskId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Them checklist item' })
  @ApiResponse({ status: 201, description: 'Checklist item created' })
  async createChecklistItem(
    @Param('id') taskId: string,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.tasksService.createChecklistItem(taskId, dto);
  }

  // ============================================================
  // Checklist items by checklist ID
  // ============================================================

  @Patch('checklists/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('checklistId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Cap nhat checklist item' })
  @ApiResponse({ status: 200, description: 'Checklist item updated' })
  async updateChecklistItem(
    @Param('id') id: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.tasksService.updateChecklistItem(id, dto);
  }

  @Delete('checklists/:id')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('checklistId')
  @WorkspaceRoles(Role.OWNER, Role.ADMIN, Role.MEMBER)
  @ApiOperation({ summary: 'Xoa checklist item' })
  @ApiResponse({ status: 200, description: 'Checklist item deleted' })
  async deleteChecklistItem(@Param('id') id: string) {
    return this.tasksService.deleteChecklistItem(id);
  }
}
