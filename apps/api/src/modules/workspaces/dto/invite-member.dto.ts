import { IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({
    example: 'member@example.com',
    description: 'Email of the person to invite',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'MEMBER',
    description: 'Role to assign (ADMIN, MEMBER, VIEWER)',
    enum: [Role.ADMIN, Role.MEMBER, Role.VIEWER],
    required: false,
    default: Role.MEMBER,
  })
  @IsEnum(Role, { message: 'Role must be ADMIN, MEMBER, or VIEWER' })
  @IsOptional()
  role?: Role;
}
