import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'comments' };
  }
}
