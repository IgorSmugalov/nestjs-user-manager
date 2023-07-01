import { Prisma } from '@prisma/client';
import { ProfileIdDTO } from '../dto/params.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { ProfileEntity } from '../entities/profile.entity';

export type CreateProfile = Prisma.ProfileGetPayload<{
  select: {
    name: true;
    surname: true;
    avatar: true;
  };
}>;

export type CreateProfileInput = Omit<CreateProfile, 'avatar'> & {
  avatar: Express.Multer.File;
};

export type UpdateProfileInput = Partial<CreateProfileInput>;

export type ProfileId = Prisma.ProfileGetPayload<{
  select: { id: true };
}>;

export interface IGetByIdOptions {
  throwOnNotFound?: boolean;
  throwOnFound?: boolean;
}

export interface IProfileService {
  getById(dto: ProfileIdDTO, options?: IGetByIdOptions): Promise<ProfileEntity>;
  update(
    updateDto: UpdateProfileDTO,
    idDto: ProfileIdDTO,
  ): Promise<ProfileEntity>;
  deleteAvatar(dto: ProfileIdDTO): Promise<ProfileEntity>;
  // create(createDto: CreateProfileDTO, idDto: ProfileIdDTO): Promise<Profile>;
}
