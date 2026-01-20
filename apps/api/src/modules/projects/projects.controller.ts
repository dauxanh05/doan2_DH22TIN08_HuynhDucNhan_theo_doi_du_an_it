import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'projects' };
  }
}
