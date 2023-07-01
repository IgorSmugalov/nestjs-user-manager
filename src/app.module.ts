import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { AccessJwtAuthMiddleware } from './auth/middlewares/access-jwt-auth.middleware';
import { RefreshJwtAuthMiddleware } from './auth/middlewares/refresh-jwt-auth.middleware';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './utils/exception/global-exception.filter';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MaxFileSizeConstraint } from './utils/validation/maxFileSize.validator';
import { IsImageBufferConstraint } from './utils/validation/isImage';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    CryptoModule,
    UserModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    IsImageBufferConstraint,
    MaxFileSizeConstraint,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessJwtAuthMiddleware).forRoutes('*');
    consumer
      .apply(RefreshJwtAuthMiddleware)
      .forRoutes('/auth/refresh', '/auth/logout');
  }
}
