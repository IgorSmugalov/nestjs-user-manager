import { Module } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CaslModule } from 'nest-casl';

@Module({
  imports: [
    CaslModule.forRoot<Role>({
      superuserRole: Role.superadmin,
      getUserFromRequest: (req) => req.user,
    }),
  ],
})
export class PermissionModule {}
