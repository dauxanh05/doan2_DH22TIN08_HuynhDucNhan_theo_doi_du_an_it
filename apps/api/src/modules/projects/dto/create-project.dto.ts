import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'DevTeamOS Backend',
    description: 'Ten project (2-100 ky tu)',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'Backend API cho he thong quan ly du an',
    description: 'Mo ta project',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '#6366f1',
    description: 'Ma mau project (hex color)',
    required: false,
    default: '#6366f1',
  })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'code',
    description: 'Icon name cho project',
    required: false,
  })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;
}
