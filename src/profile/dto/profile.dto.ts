import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { Expose, TransformPlainToInstance } from 'class-transformer';
import { IsDate, IsString, IsUUID, MinLength } from 'class-validator';
import { AssetsService } from 'src/assets/assets.service';

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

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @Expose()
  avatar: string;

  @TransformPlainToInstance(ProfileDTO, {
    strategy: 'excludeAll',
  })
  static fromPrisma(
    profile: Profile,
    assetsService: AssetsService,
  ): ProfileDTO {
    if (profile?.avatar)
      profile.avatar = assetsService.getAvatarPath(profile.avatar);
    return profile;
  }
}
