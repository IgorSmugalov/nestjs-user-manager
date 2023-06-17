import { ApiProperty } from '@nestjs/swagger';
import { UserAuthData } from '@prisma/client';
import { Expose } from 'class-transformer';
export class UserAuthDataEntity implements UserAuthData {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  password: string;

  @Expose()
  @ApiProperty()
  activated: boolean;

  @Expose()
  @ApiProperty()
  activationKey: string;

  @Expose()
  @ApiProperty()
  activationKeyCreated: Date;

  @Expose()
  @ApiProperty()
  userProfileId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
