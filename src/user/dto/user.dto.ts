import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class UserDTO implements User {
  @Expose()
  @IsUUID(4)
  @ApiProperty()
  id: string;

  @Expose()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Expose()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 0,
  })
  @ApiProperty()
  password: string;

  @Expose()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @Expose()
  @IsBoolean()
  @ApiProperty()
  activated: boolean;

  @Expose()
  @IsUUID(4)
  @ApiProperty()
  activationKey: string;

  @Expose()
  @IsDate()
  @ApiProperty()
  activationKeyCreated: Date;

  @Expose()
  @IsString()
  @ApiProperty()
  userProfileId: string;

  @Expose()
  @IsUUID(4)
  @ApiProperty()
  recoveryPasswordKey: string;

  @Expose()
  @IsDate()
  @ApiProperty()
  recoveryPasswordKeyCreated: Date;

  @Expose()
  @IsDate()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @IsDate()
  @ApiProperty()
  updatedAt: Date;
}
