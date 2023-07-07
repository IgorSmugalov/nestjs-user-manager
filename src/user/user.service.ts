import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import { Prisma } from '@prisma/client';
import {
  ActivationKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { UserDTO } from './dto/user.dto';
import { IGetUserOptions } from './types';
import { UserActivationKeyDTO, UserEmailDTO } from './dto/params.dto';
import { ConfigService } from '@nestjs/config';
import { USER_CONFIG } from 'src/config/const';
import { IUserConfig } from 'src/config/user.config';
import { HashService } from 'src/crypto/hash.service';
import { MailerService } from 'src/mailer/mailer.service';
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { ActivationUserResponseDTO } from './dto/activation-user-response.dto';
import * as uuid from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
  ) {}
  private config = this.configService.get<IUserConfig>(USER_CONFIG);

  public async registerUser(dto: CreateUserAndProfileDTO) {
    dto.password = await this.hashService.hashPassword(dto.password);
    await this.get(dto, { throwOnFound: true });
    const user = await this.prisma.user.create({
      data: dto.createUserAndProfileInput(),
    });
    await this.mailerService.sendActivationMessage(user);
    return CreateUserResponseDTO.fromPrisma(user);
  }

  public async get(
    dto: Prisma.UserWhereUniqueInput,
    options?: IGetUserOptions,
  ): Promise<UserDTO> {
    const user = await this.prisma.user.findUnique({
      where: this.userUniqueInput(dto),
    });
    if (options?.throwOnFound && user) throw new UserAlreadyExistsException();
    if (options?.throwOnNotFound && !user)
      throw new UserDoesNotExistsException();
    return UserDTO.fromUser(user);
  }

  public async acivateByKey(dto: UserActivationKeyDTO) {
    const { activationKey } = dto;
    let user = await this.get({
      activationKey,
    });
    if (!user || !this.isValidKey(user?.activationKeyCreated, 'activation')) {
      throw new ActivationKeyNotValidException();
    }
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        activated: true,
        activationKey: null,
        activationKeyCreated: null,
      },
    });
    return ActivationUserResponseDTO.fromUser(user);
  }

  public async renewActivationKey({ email }: UserEmailDTO) {
    let user = await this.get({ email }, { throwOnNotFound: true });
    if (user.activated) throw new UserAlreadyActivatedException();
    user = await this.prisma.user.update({
      where: { email },
      data: { activationKeyCreated: new Date(), activationKey: uuid.v4() },
    });
    await this.mailerService.sendActivationMessage(user);
    return ActivationUserResponseDTO.fromUser(user);
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

  private isValidKey(
    keyCreationalDate: Date,
    target: 'activation' | 'passwordRestoring',
  ): boolean {
    const now = Date.now();
    const createdAt = keyCreationalDate.getTime();
    const expiresAfter = this.config[`${target}KeyExpiresAfter`];
    return now - createdAt < expiresAfter;
  }
}

// TODO: for get -> Добавить возможность выбора выбрасываемой ошибки

// TODO: for update -> Добавить prisma validator
