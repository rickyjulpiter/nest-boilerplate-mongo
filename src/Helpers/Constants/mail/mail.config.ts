import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAILHOST,
  port: process.env.EMAILPORT,
  secure: true,
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASSWORD,
  },
});

export const emailTemplate = (otp: string) => {
  return `<div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
            <h2>Welcome to Sistem Pintar.</h2>
            <p style="margin-bottom: 30px;">Please enter the sign-up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
          </div>`;
};
