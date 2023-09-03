import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { AccessJwtAuthMiddleware } from './auth/middlewares/access-jwt-auth.middleware';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './lib/exception/global-exception.filter';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { MaxFileSizeConstraint } from './lib/validation/max-file-size.validator';
import { IsImageBufferConstraint } from './lib/validation/isImage.validator';
import { MailerModule } from './mailer/mailer.module';
import { EventsModule } from './events/events.module';
import { CaslModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    CryptoModule,
    UserModule,
    ProfileModule,
    MailerModule,
    EventsModule,
    CaslModule,
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
  }
}
