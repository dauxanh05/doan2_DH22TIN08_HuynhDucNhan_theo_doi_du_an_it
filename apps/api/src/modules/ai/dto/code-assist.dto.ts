import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CodeAssistDto {
  @ApiProperty({
    example: 'Thiết kế JWT authentication flow cho NestJS với refresh token rotation',
    description: 'Mô tả yêu cầu kỹ thuật cần AI hỗ trợ (tối thiểu 5 ký tự)',
  })
  @IsString({ message: 'prompt must be a string' })
  @IsNotEmpty({ message: 'prompt is required' })
  @MinLength(5, { message: 'prompt must be at least 5 characters' })
  prompt: string;

  @ApiProperty({
    example: 'Project: E-commerce. Stack: React 18, NestJS 10, Prisma, PostgreSQL',
    description: 'Context của project để AI đưa ra gợi ý phù hợp (optional)',
    required: false,
  })
  @IsString({ message: 'projectContext must be a string' })
  @IsOptional()
  projectContext?: string;
}
