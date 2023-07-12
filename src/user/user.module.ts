import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { MailerModule } from 'src/mailer/mailer.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from './user.repository';

@Module({
  imports: [PrismaModule, MailerModule, CryptoModule, HttpModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
