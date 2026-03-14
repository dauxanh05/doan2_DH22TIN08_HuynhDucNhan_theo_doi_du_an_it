import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestAssigneeDto {
  @ApiProperty({
    example: 'clxx...',
    description: 'ID của task cần gợi ý người thực hiện',
  })
  @IsString({ message: 'taskId must be a string' })
  @IsNotEmpty({ message: 'taskId is required' })
  taskId: string;

  @ApiProperty({
    example: 'clxx...',
    description: 'ID của project chứa task',
  })
  @IsString({ message: 'projectId must be a string' })
  @IsNotEmpty({ message: 'projectId is required' })
  projectId: string;

  @ApiProperty({
    example: 'clxx...',
    description: 'ID của workspace chứa các members',
  })
  @IsString({ message: 'workspaceId must be a string' })
  @IsNotEmpty({ message: 'workspaceId is required' })
  workspaceId: string;
}
