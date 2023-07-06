import { registerAs } from '@nestjs/config';
import { JWK_CONFIG } from './const';

export interface IJwkConfig {
  algorithm: string;
  privatePemFile: string;
  publicPemFile: string;
}

export interface IJwkSetConfig {
  dir: string;
  accessJwkConfig: IJwkConfig;
  refreshJwkConfig: IJwkConfig;
}

export const jwkConfig = registerAs<IJwkSetConfig>(JWK_CONFIG, () => ({
  dir: process.env.JWK_KEYS_DIR,
  accessJwkConfig: {
    algorithm: process.env.JWK_ACCESS_KEY_ALGORITHM,
    privatePemFile: process.env.JWK_ACCESS_PRIVATE_KEY_FILE,
    publicPemFile: process.env.JWK_ACCESS_PUBLIC_KEY_FILE,
  },
  refreshJwkConfig: {
    algorithm: process.env.JWK_REFRESH_KEY_ALGORITHM,
    privatePemFile: process.env.JWK_REFRESH_PRIVATE_KEY_FILE,
    publicPemFile: process.env.JWK_REFRESH_PUBLIC_KEY_FILE,
  },
}));
