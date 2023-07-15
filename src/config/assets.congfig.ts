import { registerAs } from '@nestjs/config';
import { ASSETS_CONFIG } from './const';

export interface IAssetsConfig {
  assetsDir: string;
  avatarDir: string;
}

export const assetsConfig = registerAs<IAssetsConfig>(ASSETS_CONFIG, () => ({
  assetsDir: process.env.ASSETS_DIR,
  avatarDir: process.env.ASSETS_AVATARS_DIR,
}));
