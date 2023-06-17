import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [CryptoModule],
})
export class PrismaModule {}
