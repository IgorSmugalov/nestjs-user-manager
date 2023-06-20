import { PickType } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

export class UserCredentialsDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
]) {}
