import { Module } from '@nestjs/common';
import { ConfigModule as Config } from '@nestjs/config';
import { jwkConfig } from './jwk.config';
import { jwtConfig } from './jwt.config';

@Module({
  imports: [
    Config.forRoot({
      isGlobal: true,
      load: [jwkConfig, jwtConfig],
    }),
  ],
})
export class ConfigModule {}
