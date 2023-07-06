import { Prisma } from '@prisma/client';
import { CreateProfileInput } from 'src/profile/types';

// Create User

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

// User service

export interface IGetUserOptions {
  throwOnNotFound?: boolean;
  throwOnFound?: boolean;
}
