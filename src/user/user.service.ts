import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import { Prisma, User } from '@prisma/client';
import {
  ActivationKeyNotValidException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { IGetUserOptions } from './types';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto/params.dto';
import { ConfigService } from '@nestjs/config';
import { USER_CONFIG } from 'src/config/const';
import { IUserConfig } from 'src/config/user.config';
import { HashService } from 'src/crypto/hash.service';
import { MailerService } from 'src/mailer/mailer.service';
import * as uuid from 'uuid';
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
  ) {}
  private config = this.configService.get<IUserConfig>(USER_CONFIG);

  public async create(dto: CreateUserAndProfileDTO) {
    await this.get(dto, { throwOnFound: true });
    dto.password = await this.hashService.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: dto.createUserAndProfileInput(),
    });
    await this.mailerService.sendActivationMessage(user);
    return user;
  }

  public async get(
    dto: Prisma.UserWhereUniqueInput,
    options?: IGetUserOptions,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: this.userUniqueInput(dto),
    });
    if (options?.throwOnFound && user) throw new UserAlreadyExistsException();
    if (options?.throwOnNotFound && !user)
      throw new UserDoesNotExistsException();
    return user;
  }

  public async acivateByKey(dto: UserActivationKeyDTO): Promise<User> {
    const { activationKey } = dto;
    let user = await this.get({
      activationKey,
    });
    if (
      !user ||
      !this.isKeyExpired(
        user?.activationKeyCreated,
        this.config.activationKeyMaxAge,
      )
    ) {
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
    return user;
  }

  public async renewActivationKey(dto: UserEmailDTO): Promise<User> {
    const { email } = dto;
    let user = await this.get({ email }, { throwOnNotFound: true });
    if (user.activated) throw new UserAlreadyActivatedException();
    user = await this.prisma.user.update({
      where: { email },
      data: { activationKeyCreated: new Date(), activationKey: uuid.v4() },
    });
    await this.mailerService.sendActivationMessage(user);
    return user;
  }

  // Password recovering

  public async initPasswordRecovering(dto: UserEmailDTO): Promise<User> {
    const { email } = dto;
    let user = await this.get({ email }, { throwOnNotFound: true });
    user = await this.prisma.user.update({
      where: { email },
      data: {
        recoveryPasswordKey: uuid.v4(),
        recoveryPasswordKeyCreated: new Date(),
      },
    });
    await this.mailerService.sendPasswordRecoveryMessage(user);
    return user;
  }

  public async validatePasswordRecoveryKey(
    dto: UserRecoveryPasswordKeyDTO,
  ): Promise<User> {
    const user = await this.get({
      recoveryPasswordKey: dto.recoveryPasswordKey,
    });
    if (
      !user ||
      !this.isKeyExpired(
        user?.recoveryPasswordKeyCreated,
        this.config.passwordRecoveryKeyMaxAge,
      )
    ) {
      throw new PasswordRecoveryKeyNotValidException();
    }
    return user;
  }

  public async finishPasswordRecovering(
    dto: RecoveryPasswordDTO,
  ): Promise<User> {
    await this.validatePasswordRecoveryKey(dto);
    dto.password = await this.hashService.hashPassword(dto.password);
    return await this.prisma.user.update({
      where: { recoveryPasswordKey: dto.recoveryPasswordKey },
      data: {
        password: dto.password,
        recoveryPasswordKey: null,
        recoveryPasswordKeyCreated: null,
      },
    });
  }

  // Utils

  private userUniqueInput(input: Prisma.UserWhereUniqueInput) {
    const { id, email, activationKey, recoveryPasswordKey, userProfileId } =
      input;
    return Prisma.validator<Prisma.UserWhereUniqueInput>()({
      email,
      id,
      activationKey,
      recoveryPasswordKey,
      userProfileId,
    });
  }

  private isKeyExpired(keyIssTime: Date, keyMaxAge: number): boolean {
    const now = Date.now();
    const createdAt = keyIssTime.getTime();
    return now - createdAt < keyMaxAge;
  }
}

// TODO: for get -> Добавить возможность выбора выбрасываемой ошибки

// TODO: for update -> Добавить prisma validator

// TODO: for all -> заменить DTO на типы
