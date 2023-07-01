import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { Expose, plainToInstance } from 'class-transformer';
import { AssetsService } from 'src/assets/assets.service';

export class ProfileEntity implements Profile {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  surname: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: 'string', format: 'binary' })
  @Expose()
  avatar: string;

  static fromPrisma(
    profile: Profile,
    assetsService: AssetsService,
  ): ProfileEntity {
    const entity = plainToInstance(this, profile, {
      excludeExtraneousValues: true,
    });
    if (entity.avatar)
      entity.avatar = assetsService.getAvatarPath(entity.avatar);
    return entity;
  }
}
