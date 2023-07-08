import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import { Prisma } from '@prisma/client';
import {
  ActivationKeyNotValidException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
  UserAlreadyExistsException,
  UserDoesNotExistsException,
} from './user.exceptions';
import { UserDTO } from './dto/user.dto';
import { IGetUserOptions, RecoveryPassword } from './types';
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

  public async create(dto: CreateUserAndProfileDTO) {
    await this.get(dto, { throwOnFound: true });
    dto.password = await this.hashService.hashPassword(dto.password);
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
    return ActivationUserResponseDTO.fromUser(user);
  }

  public async renewActivationKey(emailDto: UserEmailDTO) {
    const { email } = emailDto;
    let user = await this.get({ email }, { throwOnNotFound: true });
    if (user.activated) throw new UserAlreadyActivatedException();
    user = await this.prisma.user.update({
      where: { email },
      data: { activationKeyCreated: new Date(), activationKey: uuid.v4() },
    });
    await this.mailerService.sendActivationMessage(user);
    return ActivationUserResponseDTO.fromUser(user);
  }

  // Password recovering

  public async initPasswordRecovering(emailDto: UserEmailDTO) {
    const { email } = emailDto;
    const user = await this.get({ email }, { throwOnNotFound: true });
    await this.prisma.user.update({
      where: { email },
      data: {
        recoveryPasswordKey: uuid.v4(),
        recoveryPasswordKeyCreated: new Date(),
      },
    });
    return user;
  }

  public async validatePasswordRecoveryKey(keyDto: UserRecoveryPasswordKeyDTO) {
    const user = await this.get({
      recoveryPasswordKey: keyDto.recoveryPasswordKey,
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

  public async finishPasswordRecovering(recoveryDto: RecoveryPassword) {
    await this.validatePasswordRecoveryKey(recoveryDto);
    recoveryDto.password = await this.hashService.hashPassword(
      recoveryDto.password,
    );
    return await this.prisma.user.update({
      where: { recoveryPasswordKey: recoveryDto.recoveryPasswordKey },
      data: {
        password: recoveryDto.password,
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
