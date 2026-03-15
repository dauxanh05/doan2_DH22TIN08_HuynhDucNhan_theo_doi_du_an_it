import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtUser } from '@/modules/auth/interfaces/jwt-payload.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Lấy danh sách comments của task' })
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAll(taskId);
  }

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Tạo comment mới cho task' })
  create(
    @Param('taskId') taskId: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(taskId, user.id, dto);
  }

  @Patch('comments/:id')
  @ApiOperation({ summary: 'Cập nhật comment (chỉ tác giả)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, user.id, dto);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa comment (chỉ tác giả)' })
  delete(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.commentsService.delete(id, user.id);
  }
}
