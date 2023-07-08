import { registerAs } from '@nestjs/config';
import { USER_CONFIG } from './const';

export interface IUserConfig {
  activationKeyMaxAge: number;
  passwordRecoveryKeyMaxAge: number;
}

export const userConfig = registerAs<IUserConfig>(USER_CONFIG, () => ({
  activationKeyMaxAge: Number(process.env.USER_ACTIVATION_KEY_EXPIRES_AFTER),
  passwordRecoveryKeyMaxAge: Number(
    process.env.USER_PASSWORD_RECOVERY_KEY_EXPIRES_AFTER,
  ),
}));

export type UserKeysMaxAgeKeys = keyof Pick<
  IUserConfig,
  'activationKeyMaxAge' | 'passwordRecoveryKeyMaxAge'
>;
