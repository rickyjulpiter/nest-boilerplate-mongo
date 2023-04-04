import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import { BadGatewayException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { emailTemplate, transporter } from './Constants/mail/mail.config';

dotenv.config();

export default class Helpers {
  decrypt(ciphertext: string): object {
    const KEY = process.env.CRYPTO_KEY;

    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(originalText);
  }

  response(res, status, message = '', data?: any, error = ''): any {
    res.status(status).send({
      message,
      error,
      data,
    });
  }

  async sendEmail(to?: string, otp?: string, subject?: string) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: to || 'rickyjulpiter@sistempintar.com',
        subject: subject || 'No-Reply: Verification Code',
        html: emailTemplate(otp),
      });
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }
}
