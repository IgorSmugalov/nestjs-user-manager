import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { jwtConfig } from './jwt.config';
import { pathConfig } from './path.congfig';
import { jwkConfig } from './jwk.config';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      load: [jwkConfig, jwtConfig, pathConfig],
    }),
  ],
})
export class ConfigModule {}
