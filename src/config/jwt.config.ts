import { registerAs } from '@nestjs/config';
import { JWT_CONFIG } from '.';

export interface IJwtConfig {
  algorithm: string;
  expires: string;
}

export interface IJwtSetConfig {
  accessJwtConfig: IJwtConfig;
  refreshJwtConfig: IJwtConfig;
}

export const jwtConfig = registerAs<IJwtSetConfig>(JWT_CONFIG, () => ({
  accessJwtConfig: {
    algorithm: process.env.JWT_ACCESS_ALGORITHM,
    expires: process.env.JWT_ACCESS_EXPIRES,
  },
  refreshJwtConfig: {
    algorithm: process.env.JWT_REFRESH_ALGORITHM,
    expires: process.env.JWT_REFRESH_EXPIRES,
  },
}));
