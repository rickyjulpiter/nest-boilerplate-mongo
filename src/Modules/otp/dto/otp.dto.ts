import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateOTPDto {
  @IsString()
  @ApiProperty()
  readonly email: string;
}

export class AuthenticateOTPDto {
  @IsString()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly otp: string;
}
