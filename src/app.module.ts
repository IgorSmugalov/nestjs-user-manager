import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { AccessJwtAuthMiddleware } from './auth/middlewares/access-jwt-auth.middleware';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, CryptoModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessJwtAuthMiddleware).forRoutes('*');
  }
}
