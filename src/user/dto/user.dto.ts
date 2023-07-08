import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose, TransformPlainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
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

  @TransformPlainToInstance(UserDTO, {
    strategy: 'excludeAll',
  })
  static fromUser(profile: User): UserDTO {
    return profile;
  }
}
