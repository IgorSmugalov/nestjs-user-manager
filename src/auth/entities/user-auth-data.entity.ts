import { ApiProperty } from '@nestjs/swagger';
import { UserAuthData } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsStrongPassword, IsUUID } from 'class-validator';
export class UserAuthDataEntity implements UserAuthData {
  @Expose()
  @ApiProperty()
  @IsUUID(4)
  id: string;

  @Expose()
  @ApiProperty()
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 0,
  })
  password: string;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  activated: boolean;

  @Expose()
  @ApiProperty()
  @IsUUID(4)
  activationKey: string;

  @Expose()
  @ApiProperty()
  activationKeyCreated: Date;

  @Expose()
  @ApiProperty()
  @IsUUID(4)
  userProfileId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
