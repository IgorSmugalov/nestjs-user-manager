import { IntersectionType, PickType } from '@nestjs/swagger';
import { SignInInput } from '../types';
import { CreateProfileDTO } from 'src/profile/dto/create-profile.dto';
import { UserDTO } from './user.dto';

class PartialUser extends PickType(UserDTO, ['email', 'password']) {}
class PartialProfile extends PickType(CreateProfileDTO, ['name', 'surname']) {}

export class SignUpDTO
  extends IntersectionType(PartialUser, PartialProfile)
  implements SignInInput {}
