import { Prisma } from '@prisma/client';
import { CreateProfileInput } from 'src/profile/types';

type CreateUserInput = Prisma.UserGetPayload<{
  select: { email: true; password: true };
}>;

export type CreateUserAndProfileInput = CreateUserInput &
  Pick<CreateProfileInput, 'name' | 'surname'>;

export type CreateUserResponse = Prisma.UserGetPayload<{
  select: { email: true };
}>;

export type ActivationUserResponse = Prisma.UserGetPayload<{
  select: { email: true; activated: true };
}>;

export type RecoveryPassword = Prisma.UserGetPayload<{
  select: { recoveryPasswordKey: true; password: true };
}>;

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

export interface IGetUserOptions {
  throwOnNotFound?: boolean;
  throwOnFound?: boolean;
}
