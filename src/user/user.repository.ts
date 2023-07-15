import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInInput, GetUniqueUserInput } from './types';
import { Class, Exact } from 'type-fest';
import {
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async save(input: SignInInput) {
    const { email, password } = input;
    try {
      return await this.prisma.user.create({
        data: {
          email,
          password,
        },
      });
    } catch (error) {
      this.parseError(error);
    }
  }

  /**
   * Return one User or throw User Does Not Exists Exception
   * @param {GetUniqueUserInput} where - Accept only one unique search key!
   **/
  public async getUnique<T extends Exact<GetUniqueUserInput, T>>(
    where: T,
  ): Promise<User | never> {
    let user: User | null;
    try {
      user = await this.prisma.user.findUnique({ where });
    } catch (error) {
      this.parseError(error);
    }
    if (user) return user;
    throw new UserDoesNotExistsException();
  }

  public async updateUnique<T extends Exact<GetUniqueUserInput, T>>(
    where: T,
    data: Prisma.UserUpdateInput,
  ) {
    try {
      return await this.prisma.user.update({ where, data });
    } catch (error) {
      this.parseError(error);
    }
  }

  private parseError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new UserAlreadyExistsException();
        case 'P2025':
          throw new UserDoesNotExistsException();
        default:
          throw new InternalServerErrorException(error.code);
      }
    }
    throw new InternalServerErrorException(error?.code ?? error?.message);
  }

  //TODO: WIP: add new "get" method with options: error on found/not found, validate user entity Fn

  public async extendedGet<T extends Exact<GetUniqueUserInput, T>>(
    input: T,
    options: {
      validate: (user: User | null) => boolean;
      errorClass: Class<HttpException>;
    },
  ) {
    const user = await this.getUnique(input);
    if (!options.validate(user)) {
      throw new options.errorClass();
    }
    return user;
  }
}
