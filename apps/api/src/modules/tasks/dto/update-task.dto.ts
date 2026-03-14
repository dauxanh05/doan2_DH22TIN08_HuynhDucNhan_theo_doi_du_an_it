import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, Priority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Implement login page v2',
    description: 'Tieu de task (2-200 ky tu)',
    required: false,
  })
  @IsString({ message: 'Title must be a string' })
  @MinLength(2, { message: 'Title must be at least 2 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Cap nhat mo ta',
    description: 'Mo ta task (plain text)',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'Trang thai task',
    enum: TaskStatus,
    required: false,
  })
  @IsEnum(TaskStatus, { message: 'Status must be TODO, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    example: 'HIGH',
    description: 'Do uu tien',
    enum: Priority,
    required: false,
  })
  @IsEnum(Priority, { message: 'Priority must be URGENT, HIGH, MEDIUM, or LOW' })
  @IsOptional()
  priority?: Priority;

  @ApiProperty({
    example: '2026-04-15T00:00:00.000Z',
    description: 'Han hoan thanh (ISO date string)',
    required: false,
  })
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;
}
