import { Prisma } from '@prisma/client';
import { ProfileIdDTO } from '../dto/params.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { ProfileDTO } from '../dto/profile.dto';

// Create Profile

export type CreateProfileInput = Prisma.ProfileGetPayload<{
  select: {
    name: true;
    surname: true;
  };
}>;

// Avatar

export interface AvatarFile {
  avatar: Express.Multer.File;
}

// Update Profile

export type UpdateProfile = Partial<
  Prisma.ProfileGetPayload<{
    select: {
      name: true;
      surname: true;
      avatar: true;
    };
  }>
>;

export type UpdateAvatarFile = Partial<AvatarFile>;

export type UpdateProfileInput = Omit<UpdateProfile, 'avatar'> &
  UpdateAvatarFile;

//

export type ProfileId = Prisma.ProfileGetPayload<{
  select: { id: true };
}>;

// Profile Service

export interface IProfileService {
  getProfile(dto: ProfileIdDTO, options?: IGetByIdOptions): Promise<ProfileDTO>;
  update(updateDto: UpdateProfileDTO, idDto: ProfileIdDTO): Promise<ProfileDTO>;
  deleteAvatar(dto: ProfileIdDTO): Promise<ProfileDTO>;
}

export interface IGetByIdOptions {
  throwOnNotFound?: boolean;
  throwOnFound?: boolean;
}
