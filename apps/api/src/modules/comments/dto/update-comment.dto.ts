import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: 'Nội dung bình luận cập nhật' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;
}
