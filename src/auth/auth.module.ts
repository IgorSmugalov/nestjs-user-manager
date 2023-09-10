import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { UserModule } from 'src/user/user.module';
import { ProfileModule } from 'src/profile/profile.module';
import { RefreshJwtAuthMiddleware } from './middlewares/refresh-jwt-auth.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessJwtService, RefreshJwtService],
  imports: [
    PrismaModule,
    CryptoModule,
    forwardRef(() => UserModule),
    ProfileModule,
  ],
  exports: [AccessJwtService, RefreshJwtService, AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshJwtAuthMiddleware).forRoutes('*');
  }
}
