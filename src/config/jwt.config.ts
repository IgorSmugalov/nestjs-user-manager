import { registerAs } from '@nestjs/config';
import { JWT_CONFIG } from './const';

export interface IJwtConfig {
  algorithm: string;
  expiresAfter: number;
}

export interface IJwtSetConfig {
  accessJwtConfig: IJwtConfig;
  refreshJwtConfig: IJwtConfig;
}

export const jwtConfig = registerAs<IJwtSetConfig>(JWT_CONFIG, () => ({
  accessJwtConfig: {
    algorithm: process.env.JWT_ACCESS_ALGORITHM,
    expiresAfter: Number(process.env.JWT_ACCESS_EXPIRES_AFTER),
  },
  refreshJwtConfig: {
    algorithm: process.env.JWT_REFRESH_ALGORITHM,
    expiresAfter: Number(process.env.JWT_REFRESH_EXPIRES_AFTER),
  },
}));
