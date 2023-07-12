import { Prisma } from '@prisma/client';
import { CreateProfileInput } from 'src/profile/types';
import { RequireExactlyOne } from 'type-fest';

type CreateUserInput = Prisma.UserGetPayload<{
  select: { email: true; password: true };
}>;

export type CreateUserAndProfileInput = CreateUserInput &
  Pick<CreateProfileInput, 'name' | 'surname'>;

export type CreateUserResponse = Prisma.UserGetPayload<{
  select: { email: true };
}>;

export type UserResponse = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    activated: true;
    createdAt: true;
    updatedAt: true;
    userProfileId: true;
  };
}>;

export type ActivationUserResponse = Prisma.UserGetPayload<{
  select: { email: true; activated: true };
}>;

export type RecoveryPassword = Prisma.UserGetPayload<{
  select: { recoveryPasswordKey: true; password: true };
}>;

export type UpdatePassword = Prisma.UserGetPayload<{
  select: { password: true };
}> & { newPassword: string };

// User params

export type UserId = Prisma.UserGetPayload<{
  select: { id: true };
}>;

export type UserEmail = Prisma.UserGetPayload<{
  select: { email: true };
}>;

export type UserActivationKey = Prisma.UserGetPayload<{
  select: { activationKey: true };
}>;

export type UserRecoveryPasswordKey = Prisma.UserGetPayload<{
  select: { recoveryPasswordKey: true };
}>;

// User service

export type GetUniqueUserInput = RequireExactlyOne<Prisma.UserWhereUniqueInput>;
export type GetPartialUniqueUserInput = RequireExactlyOne<
  Pick<Prisma.UserWhereUniqueInput, 'id' | 'email'>
>;
