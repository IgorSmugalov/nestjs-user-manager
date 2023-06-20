import { Prisma } from '@prisma/client';

export type CreateUser = Prisma.UserGetPayload<{
  select: { email: true; password: true };
}>;

export type UserId = Prisma.UserGetPayload<{
  select: { id: true };
}>;

export type UserEmail = Prisma.UserGetPayload<{
  select: { email: true };
}>;
