import { Body, Controller, Get, Param, Req } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  ForbiddenException,
  HttpStatus,
  Logger,
  NotFoundException,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

import { User } from '../../Schemas/user.schema';

import { UsersService } from './users.service';
import Helpers from '../../Helpers/helpers';
import { UpdatePasswordDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  private readonly helpers = new Helpers();

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get()
  @ApiOperation({
    summary: 'Retrieve user details upon authentication',
    description: '',
    tags: ['Users'],
  })
  async get(@Req() req, @Res() res) {
    const user = await this.usersService.findOneByEmail(req.user.email);
    return this.helpers.response(res, HttpStatus.OK, '', {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
    });
  }

  @Get(':email')
  @ApiOperation({
    summary: 'Retrieve user details based on email address',
    description: '',
    tags: ['Users'],
  })
  async findOne(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'We are sorry, but the user you are looking for does not exist in our system. Please check the provided user and try again.',
      );
    }

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch()
  @ApiOperation({
    summary: 'Update user details',
    description: '',
    tags: ['Users'],
  })
  async update(@Body() users, @Req() req, @Res() res) {
    await this.usersService.updateProfile(req.user.userId, users);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      'User details have been updated successfully.',
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Patch('update-password')
  @ApiOperation({
    summary: 'Update user password',
    description: '',
    tags: ['Users'],
  })
  async updatePassword(
    @Body() password: UpdatePasswordDto,
    @Req() req,
    @Res() res,
  ) {
    const email = req.user.email;
    const user = await this.usersService.findOneByEmail(email);

    const compareOldPassword = await bcrypt.compare(
      password.oldPassword,
      user.password,
    );

    if (!compareOldPassword) {
      Logger.warn(
        `${email} failed to update password, since the old password is wrong`,
      );
      throw new ForbiddenException('Invalid old password provided');
    }

    const newPassword = await this.helpers.hashPassword(password.newPassword);
    await this.usersService.updatePassword(user.id, newPassword);

    return this.helpers.response(res, HttpStatus.OK, 'Password updated');
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: 'Reset user password',
    description: '',
    tags: ['Users'],
  })
  async resetPassword(@Body() users: any, @Res() res) {
    const user = await this.usersService.findOneByEmail(users.email);

    if (!user) {
      const errorMessage = `The provided email address (${users.email}) could not be found in system. Password reset failed.`;

      Logger.warn(errorMessage);
      throw new ForbiddenException(errorMessage);
    }

    const password = await this.helpers.hashPassword(users.password);
    await this.usersService.updatePassword(user.id, password);

    return this.helpers.response(
      res,
      HttpStatus.OK,
      'Password reset successfully.',
    );
  }
}
