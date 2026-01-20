import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'notifications' };
  }
}
