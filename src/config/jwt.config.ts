import { registerAs } from '@nestjs/config';
import { JWT_CONFIG } from '.';

export const jwtConfig = registerAs(JWT_CONFIG, () => ({
  accessJwtConfig: {
    algorithm: process.env.JWT_ACCESS_ALGORITHM,
    expires: process.env.JWT_ACCESS_EXPIRES,
  },
}));

export type jwtConfig = ReturnType<typeof jwtConfig>;
