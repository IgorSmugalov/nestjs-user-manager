import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthenticatedUserDTO } from 'src/auth/dto/authenticated-user.dto';
import { USER_CONFIG } from 'src/config/const';
import { IUserConfig } from 'src/config/user.config';
import { HashService } from 'src/crypto/hash.service';
import { MailerService } from 'src/mailer/mailer.service';
import * as uuid from 'uuid';
import { CreateUserAndProfileDTO } from './dto/create-user-and-profile.dto';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto/params.dto';
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { GetPartialUniqueUserInput } from './types';
import {
  ActivationKeyNotValidException,
  KeyExpiredException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
} from './user.exceptions';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
  ) {}
  private config = this.configService.get<IUserConfig>(USER_CONFIG);

  public async signIn(dto: CreateUserAndProfileDTO) {
    dto.password = await this.hashService.hashPassword(dto.password);
    const user = await this.userRepository.save(dto);
    await this.mailerService.sendActivationMessage(user);
    return user;
  }

  /**
   * Get one User by id | email or throw User Does Not Exists Exception
   * @param {GetPartialUniqueUserInput} dto - Accept only one unique search key!
   **/
  public async getUnique(dto: GetPartialUniqueUserInput): Promise<User> {
    const { id, email } = dto;
    if (id && email) dto.email = undefined;
    return await this.userRepository.getUnique(dto);
  }

  public async updatePassword(
    authenticatedUser: AuthenticatedUserDTO,
    updatePasswordDto: UpdatePasswordDTO,
  ): Promise<User> {
    const { password, newPassword } = updatePasswordDto;
    const { id } = authenticatedUser;
    let user = await this.userRepository.getUnique({ id });
    await this.hashService.validatePassword(user.password, password, {
      throwOnFail: true,
    });
    const newHashedPassword = await this.hashService.hashPassword(newPassword);
    user = await this.userRepository.updateUnique(
      { id },
      { password: newHashedPassword },
    );
    return user;
  }

  // TODO: Add delete user

  // Activation

  public async acivateByKey(dto: UserActivationKeyDTO): Promise<User> {
    try {
      const user = await this.userRepository.getUnique(dto);
      this.validateKey(
        user.activationKeyCreated,
        this.config.activationKeyMaxAge,
      );
      return await this.userRepository.updateUnique(
        {
          activationKey: dto.activationKey,
        },
        { activationKey: null, activationKeyCreated: null, activated: true },
      );
    } catch {
      throw new ActivationKeyNotValidException();
    }
  }

  public async renewActivationKey(dto: UserEmailDTO): Promise<User> {
    const { email } = dto;
    let user = await this.userRepository.getUnique({ email });
    if (user.activated) throw new UserAlreadyActivatedException();
    user = await this.userRepository.updateUnique(
      { email },
      {
        activationKeyCreated: new Date(),
        activationKey: uuid.v4(),
      },
    );
    await this.mailerService.sendActivationMessage(user);
    return user;
  }

  // Password recovering

  public async initPasswordRecovering(dto: UserEmailDTO): Promise<User> {
    let user = await this.userRepository.getUnique(dto);
    user = await this.userRepository.updateUnique(dto, {
      recoveryPasswordKey: uuid.v4(),
      recoveryPasswordKeyCreated: new Date(),
    });
    await this.mailerService.sendPasswordRecoveryMessage(user);
    return user;
  }

  public async validatePasswordRecoveryKey(
    recoveryPasswordKeyDto: UserRecoveryPasswordKeyDTO,
  ): Promise<User> {
    try {
      const user = await this.userRepository.getUnique(recoveryPasswordKeyDto);
      this.validateKey(
        user.recoveryPasswordKeyCreated,
        this.config.passwordRecoveryKeyMaxAge,
      );
      return user;
    } catch {
      throw new PasswordRecoveryKeyNotValidException();
    }
  }

  public async finishPasswordRecovering(
    dto: RecoveryPasswordDTO,
  ): Promise<User> {
    const { recoveryPasswordKey } = dto;
    await this.validatePasswordRecoveryKey({ recoveryPasswordKey });
    const password = await this.hashService.hashPassword(dto.password);
    return await this.userRepository.updateUnique(
      { recoveryPasswordKey },
      {
        recoveryPasswordKey: null,
        password,
      },
    );
  }

  // Utils

  private validateKey(keyIssTime: Date, keyMaxAge: number): true | never {
    const now = Date.now();
    const createdAt = keyIssTime.getTime();
    if (now - createdAt < keyMaxAge) return true;
    throw new KeyExpiredException();
  }
}
