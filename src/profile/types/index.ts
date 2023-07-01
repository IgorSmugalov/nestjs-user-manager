import { Prisma } from '@prisma/client';

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
