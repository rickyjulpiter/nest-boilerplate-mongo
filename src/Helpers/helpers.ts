import * as dotenv from 'dotenv';
import { BadGatewayException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { emailTemplate, transporter } from './Constants/mail/mail.config';

dotenv.config();

export default class Helpers {
  response(
    res: Response,
    status: number,
    message = '',
    data?: any,
    error = '',
  ): void {
    res.status(status).send({
      message,
      error,
      data,
    });
  }

  async sendEmail(to?: string, otp?: string, subject?: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: to || 'example@gmail.com',
        subject: subject || 'No-Reply: Verification Code',
        html: emailTemplate(otp),
      });
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
