import Helpers from './Helpers';
import { Response } from 'express';
import { BadGatewayException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { transporter } from './Constants/mail/mail.config';

jest.mock('bcrypt');
jest.mock('./Constants/mail/mail.config');

describe('Helpers', () => {
  let helpers: Helpers;
  let mockResponse: Response;

  beforeEach(() => {
    helpers = new Helpers();
    mockResponse = {} as Response;
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.send = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('response', () => {
    it('should send the response with status, message, error, and data', () => {
      const status = 200;
      const message = 'Success';
      const data = { id: 1 };

      helpers.response(mockResponse, status, message, data);

      expect(mockResponse.status).toHaveBeenCalledWith(status);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message,
        error: '',
        data,
      });
    });
  });

  describe('sendEmail', () => {
    it('should send an email with the provided parameters', async () => {
      const to = 'test@example.com';
      const otp = '123456';
      const subject = 'Test Subject';

      await helpers.sendEmail(to, otp, subject);

      expect(transporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: process.env.EMAIL,
          to,
          subject,
        }),
      );
    });

    it('should throw a BadGatewayException if sending email fails', async () => {
      const to = 'test@example.com';
      const otp = '123456';
      const subject = 'Test Subject';

      transporter.sendMail.mockRejectedValueOnce(
        new Error('Failed to send email'),
      );

      await expect(helpers.sendEmail(to, otp, subject)).rejects.toThrowError(
        BadGatewayException,
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash the provided password using bcrypt', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const result = await helpers.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toEqual(hashedPassword);
    });
  });
});
