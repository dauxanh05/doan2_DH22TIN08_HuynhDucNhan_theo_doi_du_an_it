import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'workspaces' };
  }
}
