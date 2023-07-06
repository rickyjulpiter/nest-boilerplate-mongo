import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_CONSTANTS } from '../../Helpers/Constants';
import { OtpModule } from '../otp/otp.module';

const { secret, expiresIn } = JWT_CONSTANTS;

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret,
      signOptions: { expiresIn },
    }),
    OtpModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
