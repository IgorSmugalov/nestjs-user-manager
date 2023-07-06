import { registerAs } from '@nestjs/config';
import { USER_CONFIG } from './const';

export interface IUserConfig {
  activationKeyExpiresAfter: number;
}

export const userConfig = registerAs<IUserConfig>(USER_CONFIG, () => ({
  activationKeyExpiresAfter: Number(
    process.env.USER_ACTIVATION_KEY_EXPIRES_AFTER,
  ),
}));
