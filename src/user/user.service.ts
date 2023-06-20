import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEmailDTO, UserIdDTO } from './dto/param.dto';
import { Prisma, User } from '@prisma/client';
import {
  UserAlreadyExiststException,
  UserCreationException,
} from './user.exceptions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async createUser(dto: CreateUserDTO): Promise<User | never> {
    try {
      return await this.prisma.user.create({
        data: { ...dto, userProfile: { create: {} } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new UserAlreadyExiststException();
      throw new UserCreationException();
    }
  }

  public async getUserById(id: UserIdDTO): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: id });
  }

  public async getUserByEmail(email: UserEmailDTO): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: email });
  }
}
