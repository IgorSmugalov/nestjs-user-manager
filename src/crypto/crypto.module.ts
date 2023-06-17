import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { JwkService } from './jwk.service';

@Module({
  providers: [HashService, JwkService],
  exports: [HashService, JwkService],
})
export class CryptoModule {}
