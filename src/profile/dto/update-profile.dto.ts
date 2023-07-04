import { Expose } from 'class-transformer';
import { UpdateProfileInput } from '../types';
import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { AvatarFileDTO } from './avatar-file.dto';
import { ProfileDTO } from './profile.dto';

class ProfilePart extends PickType(ProfileDTO, ['name', 'surname']) {}

export class UpdateProfileDTO
  extends PartialType(IntersectionType(ProfilePart, AvatarFileDTO))
  implements UpdateProfileInput
{
  @Expose()
  updateProfileInput(profileId: string) {
    const { name, surname, path } = this;
    return Prisma.validator<Prisma.ProfileUpdateArgs>()({
      where: { id: profileId },
      data: { name, surname, avatar: path },
    });
  }
}
