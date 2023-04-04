import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Post } from '@nestjs/common/decorators';

import { AppService } from './app.service';

import { LocalAuthGuard } from './Modules/auth/guards/local-auth.guard';

import { AuthService } from './Modules/auth/auth.service';
import { UsersService } from './Modules/users/users.service';
import { OtpService } from './Modules/otp/otp.service';

import { AuthDto } from './Modules/auth/auth.dto';
import { UserDto } from './Modules/users/dto/user.dto';

import { User } from './Schemas/user.schema';

import Helpers from './Helpers/helpers';

@Controller()
export class AppController {
  private helpers: Helpers;
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {
    this.helpers = new Helpers();
  }

  @Get()
  @ApiOperation({
    summary: 'Healthcheck',
    description: '',
    tags: ['Default'],
  })
  healthCheck(@Res() res): string {
    return this.helpers.response(res, HttpStatus.OK, 'Health Check');
  }

  @ApiOperation({
    summary: 'Sign Up',
    description: '',
    tags: ['Registration'],
  })
  @Post('auth/sign-up')
  async signUp(@Body() user: UserDto, @Res() res): Promise<User> {
    const password = await this.helpers.hashPassword(user.password);

    await this.usersService.create(user, password);
    await this.otpService.sendOTPEmail(user.email);

    return this.helpers.response(
      res,
      HttpStatus.CREATED,
      '',
      'The user has been successfully created',
    );
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Sign In',
    description: '',
    tags: ['Authentication'],
  })
  @Post('auth/sign-in')
  async signIn(@Body() auth: AuthDto) {
    return this.authService.signIn(auth);
  }
}
