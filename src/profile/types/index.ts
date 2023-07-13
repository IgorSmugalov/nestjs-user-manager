import { Prisma } from '@prisma/client';
import { RequireExactlyOne } from 'type-fest';

export type CreateProfileInput = Prisma.ProfileGetPayload<{
  select: {
    name: true;
    surname: true;
  };
}>;

export interface AvatarFile {
  avatar: '' | string | Express.Multer.File;
}

export type UpdateProfileRequestInput = Partial<
  Prisma.ProfileGetPayload<{
    select: {
      name: true;
      surname: true;
    };
  }> &
    AvatarFile
>;

export type UpdateProfileRepositoryInput = Partial<
  Prisma.ProfileGetPayload<{
    select: {
      name: true;
      surname: true;
      avatar: true;
    };
  }>
>;

export type GetUniqueProfileInput =
  RequireExactlyOne<Prisma.ProfileWhereUniqueInput>;

export type ProfileId = Prisma.ProfileGetPayload<{
  select: { id: true };
}>;
