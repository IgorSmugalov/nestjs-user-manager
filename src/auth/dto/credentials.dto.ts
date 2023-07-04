import { PickType } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';

export class CredentialsDTO extends PickType(UserDTO, ['email', 'password']) {}
