import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssetsModule } from 'src/assets/assets.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [PrismaModule, AssetsModule],
  exports: [ProfileService],
})
export class ProfileModule {}
