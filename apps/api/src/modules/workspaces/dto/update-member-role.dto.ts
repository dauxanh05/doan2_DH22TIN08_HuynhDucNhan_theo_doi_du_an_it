import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UpdateMemberRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'New role for the member (ADMIN, MEMBER, VIEWER)',
    enum: [Role.ADMIN, Role.MEMBER, Role.VIEWER],
  })
  @IsEnum(Role, { message: 'Role must be ADMIN, MEMBER, or VIEWER' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}
