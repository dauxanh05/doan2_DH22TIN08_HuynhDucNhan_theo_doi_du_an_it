import { IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ReorderItem {
  @ApiProperty({ example: 'clxx1234...', description: 'Task ID' })
  @IsString({ message: 'ID must be a string' })
  id: string;

  @ApiProperty({ example: 0, description: 'Vi tri moi (0-based)' })
  @IsInt({ message: 'Position must be an integer' })
  @Min(0, { message: 'Position must be >= 0' })
  position: number;
}

export class ReorderTasksDto {
  @ApiProperty({
    description: 'Danh sach tasks voi vi tri moi',
    type: [ReorderItem],
  })
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items: ReorderItem[];
}
