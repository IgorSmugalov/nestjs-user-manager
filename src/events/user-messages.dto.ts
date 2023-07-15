import { PickType } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from 'src/user/dto/user.dto';

export class ActivationMessageDTO extends PickType(UserDTO, [
  'id',
  'activationKey',
  'email',
]) {
  constructor(user: User) {
    super();
    Object.assign(
      this,
      plainToInstance(ActivationMessageDTO, user, { strategy: 'excludeAll' }),
    );
  }
}

export class RecoveryPassMessageDTO extends PickType(UserDTO, [
  'recoveryPasswordKey',
  'email',
]) {
  constructor(user: User) {
    super();
    Object.assign(
      this,
      plainToInstance(RecoveryPassMessageDTO, user, { strategy: 'excludeAll' }),
    );
  }
}
