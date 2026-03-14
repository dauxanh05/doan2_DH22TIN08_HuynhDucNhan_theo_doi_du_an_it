import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeProgressDto {
  @ApiProperty({
    example: 'clxx...',
    description: 'ID của project cần phân tích tiến độ',
  })
  @IsString({ message: 'projectId must be a string' })
  @IsNotEmpty({ message: 'projectId is required' })
  projectId: string;
}
