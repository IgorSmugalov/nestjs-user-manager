import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { jwtConfig } from './jwt.config';
import { assetsConfig } from './assets.congfig';
import { jwkConfig } from './jwk.config';
import { smtpConfig } from './smtp.congfig';
import { userConfig } from './user.config';
import { serverConfig } from './server.congfig';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      load: [
        jwkConfig,
        jwtConfig,
        smtpConfig,
        userConfig,
        serverConfig,
        assetsConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
