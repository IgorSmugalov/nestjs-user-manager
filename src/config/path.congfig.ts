import { registerAs } from '@nestjs/config';
import { PATH_CONFIG } from '.';

export interface IPathConfig {
  assetsPath: string;
  avatarDir: string;
}

export const pathConfig = registerAs<IPathConfig>(PATH_CONFIG, () => ({
  assetsPath: process.env.PATH_ASSETS,
  avatarDir: process.env.PATH_AVATARS_DIR,
}));
