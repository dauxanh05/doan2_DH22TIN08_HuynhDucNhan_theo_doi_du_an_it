import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement login page',
    description: 'Tieu de task (2-200 ky tu)',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @ApiProperty({
    example: 'Tao trang login voi form email + password',
    description: 'Mo ta task (plain text)',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'TODO',
    description: 'Trang thai task',
    enum: TaskStatus,
    required: false,
    default: 'TODO',
  })
  @IsEnum(TaskStatus, { message: 'Status must be TODO, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    example: 'MEDIUM',
    description: 'Do uu tien',
    enum: Priority,
    required: false,
    default: 'MEDIUM',
  })
  @IsEnum(Priority, { message: 'Priority must be URGENT, HIGH, MEDIUM, or LOW' })
  @IsOptional()
  priority?: Priority;

  @ApiProperty({
    example: '2026-04-01T00:00:00.000Z',
    description: 'Han hoan thanh (ISO date string)',
    required: false,
  })
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;
}
