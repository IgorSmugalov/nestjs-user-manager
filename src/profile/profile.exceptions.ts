import { BadRequestException } from '@nestjs/common';

export enum ProfileExceptionMessages {
  profileDoesNotExist = 'Профиль не существует',
  profileAlreadyExist = 'Профиль уже существует',
  avatarDoesNotExist = 'Аватар отсутствует',
}

export class ProfileDoesNotExistException extends BadRequestException {
  constructor() {
    super(ProfileExceptionMessages.profileDoesNotExist);
  }
}

export class ProfileAlreadyNotExistException extends BadRequestException {
  constructor() {
    super(ProfileExceptionMessages.profileAlreadyExist);
  }
}

export class AvatarDoesNotExistException extends BadRequestException {
  constructor() {
    super(ProfileExceptionMessages.avatarDoesNotExist);
  }
}
