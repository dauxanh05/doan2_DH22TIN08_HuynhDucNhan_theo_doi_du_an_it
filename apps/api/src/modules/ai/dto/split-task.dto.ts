import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SplitTaskDto {
  @ApiProperty({
    example: 'clxx...',
    description: 'Task ID (optional, for context)',
    required: false,
  })
  @IsString({ message: 'taskId must be a string' })
  @IsOptional()
  taskId?: string;

  @ApiProperty({
    example: 'Xây dựng hệ thống authentication cho web app bao gồm JWT, OAuth, refresh token',
    description: 'Mô tả task cần chia nhỏ (tối thiểu 10 ký tự)',
  })
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description is required' })
  @MinLength(10, { message: 'description must be at least 10 characters' })
  description: string;

  @ApiProperty({
    example: 'Project: E-commerce platform. Tech stack: React, NestJS, PostgreSQL',
    description: 'Context của project để AI hiểu hơn (optional)',
    required: false,
  })
  @IsString({ message: 'projectContext must be a string' })
  @IsOptional()
  projectContext?: string;
}
