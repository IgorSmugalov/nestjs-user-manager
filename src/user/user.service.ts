import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { USER_CONFIG } from 'src/config/const';
import { IUserConfig } from 'src/config/user.config';
import { HashService } from 'src/crypto/hash.service';
import * as uuid from 'uuid';
import { SignUpDTO } from './dto/sign-up.dto';
import {
  UserActivationKeyDTO,
  UserEmailDTO,
  UserIdDTO,
  UserRecoveryPasswordKeyDTO,
} from './dto/params.dto';
import { RecoveryPasswordDTO } from './dto/recovery-password.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import {
  ActivationKeyNotValidException,
  EmailAlreadyInUseException,
  KeyExpiredException,
  PasswordRecoveryKeyNotValidException,
  UserAlreadyActivatedException,
} from './user.exceptions';
import { UserRepository } from './user.repository';
import { ProfileService } from 'src/profile/profile.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEvent } from 'src/events/events';
import {
  ActivationMessageDTO,
  RecoveryPassMessageDTO,
} from 'src/events/user-messages.dto';
import { GetPartialUniqueUserInput } from './user.types';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthenticatedUserDTO } from 'src/auth';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private config = this.configService.get<IUserConfig>(USER_CONFIG);

  /**
   * @description
   * Complex Sign In UseCase, includes next steps:
   * 1) Create user account,
   * 2) Create profile and connect to user,
   * 3) Send activation message
   * @param {SignUpDTO} dto
   * @return {Promise<User>} Unsafe User Entity
   * @throws {UserAlreadyActivatedException}
   **/
  public async signUp(dto: SignUpDTO): Promise<User> {
    dto.password = await this.hashService.hashPassword(dto.password);
    const user = await this.userRepository.save(dto);
    const profile = await this.profileService.create(user, dto);
    user.userProfileId = profile.id;
    this.eventEmitter.emit(UserEvent.signUp, new ActivationMessageDTO(user));
    return user;
  }

  /**
   * @description
   * Get one User by id | email or throw if user is not exists
   * @param {GetPartialUniqueUserInput} dto Accept only one unique User search key!
   * @return {Promise<User>} Unsafe User Entity
   * @throws {UserDoesNotExistsException}
   **/
  public async getUnique(dto: GetPartialUniqueUserInput): Promise<User> {
    return await this.userRepository.getUnique(dto);
  }

  public async updateUser(updatedUser: UserIdDTO, updatedData: UpdateUserDTO) {
    if (updatedData.email) {
      const user = await this.userRepository.find({
        email: updatedData.email,
      });
      if (user.length > 0) throw new EmailAlreadyInUseException();
    }
    return await this.userRepository.updateUnique(
      { id: updatedUser.id },
      updatedData,
    );
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
    this.eventEmitter.emit(
      UserEvent.recoveryPassword,
      new ActivationMessageDTO(user),
    );
    return user;
  }

  // Password recovering

  public async initPasswordRecovering(dto: UserEmailDTO): Promise<User> {
    let user = await this.userRepository.getUnique(dto);
    user = await this.userRepository.updateUnique(dto, {
      recoveryPasswordKey: uuid.v4(),
      recoveryPasswordKeyCreated: new Date(),
    });
    this.eventEmitter.emit(
      UserEvent.recoveryPassword,
      new RecoveryPassMessageDTO(user),
    );
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
