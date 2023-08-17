import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from './user.repository';
import { ProfileModule } from 'src/profile/profile.module';
import { CaslModule } from 'nest-casl';
import { permissions } from './user.permissions';

@Module({
  imports: [
    PrismaModule,
    CryptoModule,
    HttpModule,
    ProfileModule,
    CaslModule.forFeature({ permissions: permissions }),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
