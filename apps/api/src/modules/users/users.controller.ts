import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'users' };
  }
}
