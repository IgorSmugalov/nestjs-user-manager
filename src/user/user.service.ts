import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import { Prisma } from '@prisma/client';
import {
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { UserDTO } from './dto/user.dto';
import { IGetUserOptions, IUserService } from './types';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly prisma: PrismaService) {}

  public async createUserAndProfile(
    dto: CreateUserAndProfileDTO,
  ): Promise<UserDTO> {
    await this.getUser({ email: dto.email }, { throwOnFound: true });
    const user = await this.prisma.user.create({
      data: dto.createUserAndProfileInput(),
    });
    return UserDTO.fromPrisma(user);
  }

  public async getUser(
    input: Prisma.UserWhereUniqueInput,
    options?: IGetUserOptions,
  ): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({
      where: this.userUniqueInput(input),
    });
    if (options?.throwOnFound && user) throw new UserAlreadyExistsException();
    if (options?.throwOnNotFound && !user)
      throw new UserDoesNotExistsException();
    return UserDTO.fromPrisma(user);
  }

  private userUniqueInput(input: Prisma.UserWhereUniqueInput) {
    const { id, email, activationKey, userProfileId } = input;
    return Prisma.validator<Prisma.UserWhereUniqueInput>()({
      email,
      id,
      activationKey,
      userProfileId,
    });
  }
}
