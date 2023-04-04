import { IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @ApiProperty()
  readonly fullName: string;

  @IsString()
  @ApiProperty()
  readonly phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly subscription: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly status: boolean;
}

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  readonly newPassword: string;

  @IsString()
  @ApiProperty()
  readonly oldPassword: string;
}
