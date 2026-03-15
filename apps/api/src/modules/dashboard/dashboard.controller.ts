import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ProjectRoleGuard } from '@/common/guards/project-role.guard';
import { ResolveWorkspaceFrom } from '@/common/decorators/resolve-workspace.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('workspaces/:workspaceId/dashboard/stats')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('workspaceId')
  @ApiOperation({ summary: 'Lay thong ke tong quan workspace' })
  @ApiResponse({ status: 200, description: 'Workspace stats' })
  async getStats(@Param('workspaceId') workspaceId: string) {
    return this.dashboardService.getStats(workspaceId);
  }

  @Get('workspaces/:workspaceId/dashboard/activity')
  @UseGuards(ProjectRoleGuard)
  @ResolveWorkspaceFrom('workspaceId')
  @ApiOperation({ summary: 'Lay activity log cua workspace' })
  @ApiResponse({ status: 200, description: 'Activity log with pagination' })
  async getActivity(
    @Param('workspaceId') workspaceId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = +page! || 1;
    const parsedLimit = +limit! || 20;
    return this.dashboardService.getActivity(
      workspaceId,
      parsedPage,
      parsedLimit,
    );
  }
}
