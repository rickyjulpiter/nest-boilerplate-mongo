import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

export const JWT_CONSTANTS = {
  secret: process.env.JWT_KEY,
  expiresIn: process.env.JWT_TOKEN_EXPIRATION,
};
