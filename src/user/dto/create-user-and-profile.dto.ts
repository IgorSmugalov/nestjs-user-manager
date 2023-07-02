import { IntersectionType, PickType } from '@nestjs/swagger';
import { CreateUserAndProfileInput } from '../types';
import { CreateProfileDTO } from 'src/profile/dto/create-profile.dto';
import { Expose } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { UserDTO } from './user.dto';

class PartialUser extends PickType(UserDTO, ['email', 'password']) {}
class PartialProfile extends PickType(CreateProfileDTO, ['name', 'surname']) {}
class CreateUserAndProfile
  extends IntersectionType(PartialUser, PartialProfile)
  implements CreateUserAndProfileInput {}

export class CreateUserAndProfileDTO extends CreateUserAndProfile {
  @Expose()
  createUserAndProfileInput() {
    const { email, password, name, surname } = this;
    return Prisma.validator<Prisma.UserCreateInput>()({
      email,
      password,
      userProfile: { create: { name, surname } },
    });
  }
}
