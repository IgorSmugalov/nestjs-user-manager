import { registerAs } from '@nestjs/config';
import { SMTP_CONFIG } from './const';

export interface ISMTPConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export const smtpConfig = registerAs<ISMTPConfig>(SMTP_CONFIG, () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
}));
