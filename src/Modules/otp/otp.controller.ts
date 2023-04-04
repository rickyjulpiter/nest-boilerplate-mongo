import { Body, Controller, Post } from '@nestjs/common/decorators';
import { ApiOperation } from '@nestjs/swagger';
import {
  BadRequestException,
  HttpStatus,
  Logger,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { OtpService } from './otp.service';
import Helpers from '../../Helpers/helpers';
import { AuthenticateOTPDto, GenerateOTPDto } from './dto/otp.dto';
import { UsersService } from '../users/users.service';

@Controller('otp')
export class OtpController {
  private helpers: Helpers;
  constructor(
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
  ) {
    this.helpers = new Helpers();
  }

  @Post('/generate')
  @ApiOperation({
    summary: 'Generate OTP',
    description: '',
    tags: ['OTP'],
  })
  async create(@Body() user: GenerateOTPDto, @Res() res): Promise<any> {
    try {
      const userDB = await this.usersService.findOneByEmail(user.email);

      if (!userDB) {
        Logger.warn(`Email is not found on user's data`);

        return this.helpers.response(
          res,
          HttpStatus.NOT_FOUND,
          'Email is not found',
        );
      }

      await this.otpService.sendOTPEmail(user.email);

      return this.helpers.response(
        res,
        HttpStatus.CREATED,
        '',
        'OTP generated successfully',
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  @Post('/authenticate')
  @ApiOperation({
    summary: 'Authenticate OTP',
    description: '',
    tags: ['OTP'],
  })
  async authenticate(@Body() otp: AuthenticateOTPDto, @Res() res) {
    try {
      const { email, otp: code } = otp;

      const checking = await this.otpService.findOne(email, code);

      if (!checking) {
        return this.helpers.response(res, HttpStatus.UNAUTHORIZED);
      }

      await this.otpService.update(email);
      await this.usersService.updateStatus(email);
      return this.helpers.response(res, HttpStatus.OK, 'OTP authenticated', '');
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
