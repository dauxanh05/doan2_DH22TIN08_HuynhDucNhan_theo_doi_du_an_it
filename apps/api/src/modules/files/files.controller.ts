import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  @Get('health')
  health() {
    return { status: 'ok', module: 'files' };
  }
}
