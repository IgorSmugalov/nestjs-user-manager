import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessJwtService, RefreshJwtService],
  imports: [PrismaModule, CryptoModule],
  exports: [AccessJwtService, RefreshJwtService, AuthService],
})
export class AuthModule {}
