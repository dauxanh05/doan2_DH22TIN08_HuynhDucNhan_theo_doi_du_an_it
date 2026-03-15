import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Nội dung bình luận' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Danh sách user IDs được mention',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mentions?: string[];
}
