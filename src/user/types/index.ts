import { Prisma } from '@prisma/client';
import { CreateProfileInput } from 'src/profile/types';
import { UserDTO } from '../dto/user.dto';
import { CreateUserAndProfileDTO } from '../dto/create-user-and-profile.dto';

// Create User

type CreateUserInput = Prisma.UserGetPayload<{
  select: { email: true; password: true };
}>;

export type CreateUserAndProfileInput = CreateUserInput &
  Pick<CreateProfileInput, 'name' | 'surname'>;

// User params

export type UserId = Prisma.UserGetPayload<{
  select: { id: true };
}>;

export type UserEmail = Prisma.UserGetPayload<{
  select: { email: true };
}>;

// User service

export interface IGetUserOptions {
  throwOnNotFound?: boolean;
  throwOnFound?: boolean;
}

export interface IUserService {
  createUserAndProfile(dto: CreateUserAndProfileDTO): Promise<UserDTO>;
  getUser(
    dto: Prisma.UserWhereUniqueInput,
    options?: IGetUserOptions,
  ): Promise<UserDTO>;
}
