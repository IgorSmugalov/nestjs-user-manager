import { registerAs } from '@nestjs/config';
import { SERVER_CONFIG } from './const';

export interface IServerConfig {
  protocol: string;
  host: string;
  port: number;
}

export const serverConfig = registerAs<IServerConfig>(SERVER_CONFIG, () => ({
  protocol: process.env.PROTOCOL,
  host: process.env.HOST,
  port: Number(process.env.PORT),
}));
