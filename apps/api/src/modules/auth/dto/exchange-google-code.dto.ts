import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeGoogleCodeDto {
  @ApiProperty({ description: 'One-time Google auth code from callback' })
  @IsString({ message: 'Code phai la string' })
  @IsNotEmpty({ message: 'Code khong duoc de trong' })
  code: string;
}
