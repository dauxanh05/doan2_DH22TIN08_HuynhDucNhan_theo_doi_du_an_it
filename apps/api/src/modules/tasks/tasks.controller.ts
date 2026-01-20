import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'tasks' };
  }
}
