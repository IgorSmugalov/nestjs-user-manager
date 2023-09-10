import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProfileRepository } from './profile.repository';
import { PermissionModule } from 'src/permissions';
import { profilePermissions } from './profile.permissions';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  imports: [
    PrismaModule,
    PermissionModule.forFeature({ permissions: profilePermissions }),
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
