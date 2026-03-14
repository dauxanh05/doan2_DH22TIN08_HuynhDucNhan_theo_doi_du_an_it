import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChecklistItemDto {
  @ApiProperty({
    example: 'Cap nhat tieu de',
    description: 'Tieu de checklist item',
    required: false,
  })
  @IsString({ message: 'Title must be a string' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: true,
    description: 'Trang thai hoan thanh',
    required: false,
  })
  @IsBoolean({ message: 'Completed must be a boolean' })
  @IsOptional()
  completed?: boolean;
}
