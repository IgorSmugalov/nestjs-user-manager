import { registerAs } from '@nestjs/config';
import { JWK_CONFIG } from '.';

export const jwkConfig = registerAs(JWK_CONFIG, () => ({
  dir: process.env.JWK_KEYS_DIR,
  accessJwkConfig: {
    algorithm: process.env.JWK_ACCESS_KEY_ALGORITHM,
    privatePemFile: process.env.JWK_ACCESS_PRIVATE_KEY_FILE,
    publicPemFile: process.env.JWK_ACCESS_PUBLIC_KEY_FILE,
  },
}));

export type jwkConfig = ReturnType<typeof jwkConfig>;
