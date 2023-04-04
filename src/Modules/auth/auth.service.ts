import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpServices: OtpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      Logger.error('User is not found');
      throw new UnauthorizedException();
    }

    if (!user.status) {
      Logger.warn('User is not active, otp will be sent');

      await this.otpServices.sendOTPEmail(email);
      throw new UnauthorizedException('ACCOUNT_NOT_ACTIVATED');
    }

    const isPasswordMatch = await this.comparePassword(pass, user.password);

    if (!(user && isPasswordMatch)) {
      Logger.error('Password is not match');

      throw new UnauthorizedException();
    }
    return user;
  }

  async signIn(user: AuthDto) {
    const userDetail = await this.usersService.findOneByEmail(user.email);

    const payload = {
      userId: userDetail.id,
      email: userDetail.email,
      fullName: userDetail.fullName,
      phone: userDetail.phone,
      subscription: userDetail.subscription,
      status: userDetail.status,
    };

    Logger.log('User has been sign in successful');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
