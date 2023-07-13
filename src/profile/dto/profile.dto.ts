import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDate, IsString, IsUUID, MinLength } from 'class-validator';

export class ProfileDTO implements Profile {
  @Expose()
  @IsUUID(4)
  @ApiProperty()
  id: string;

  @ApiProperty()
  @MinLength(2)
  @Expose()
  name: string;

  @ApiProperty()
  @MinLength(2)
  @Expose()
  surname: string;

  @ApiProperty()
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @Expose()
  avatar: string;
}
