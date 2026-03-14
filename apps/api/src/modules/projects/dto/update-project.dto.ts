import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'DevTeamOS Backend v2',
    description: 'Ten project (2-100 ky tu)',
    required: false,
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Mo ta cap nhat',
    description: 'Mo ta project',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '#ef4444',
    description: 'Ma mau project (hex color)',
    required: false,
  })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'rocket',
    description: 'Icon name cho project',
    required: false,
  })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Trang thai project',
    enum: ProjectStatus,
    required: false,
  })
  @IsEnum(ProjectStatus, { message: 'Status must be ACTIVE, COMPLETED, or ARCHIVED' })
  @IsOptional()
  status?: ProjectStatus;

  @ApiProperty({
    example: '/uploads/projects/1234567890.png',
    description: 'Duong dan anh dai dien project (null de xoa anh)',
    required: false,
    nullable: true,
  })
  @IsString({ message: 'Image must be a string' })
  @IsOptional()
  image?: string | null;
}
