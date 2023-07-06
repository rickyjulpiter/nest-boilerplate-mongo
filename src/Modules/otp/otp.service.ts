import { Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';
import * as moment from 'moment';
import { Model } from 'mongoose';

import Helpers from '../../Helpers/helpers';
import { Otp } from '../../Schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OtpService {
  private helpers: Helpers;
  constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>) {
    this.helpers = new Helpers();
  }

  async create(
    email: string,
    otp: string,
    expiredAt: moment.Moment,
  ): Promise<Otp> {
    return this.otpModel.create({ email, otp, expiredAt });
  }

  async update(email: string) {
    return this.otpModel.findOneAndUpdate({ email }, { status: false });
  }

  async findOne(email: string, otp: string): Promise<Otp | null> {
    return this.otpModel.findOne({ otp, email, status: true });
  }

  async sendOTPEmail(email: string): Promise<void> {
    const expiredAt = moment().add(10, 'minutes');
    const otp = await generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.update(email);
    await this.create(email, otp, expiredAt);

    await this.helpers.sendEmail(email, otp);
  }
}
