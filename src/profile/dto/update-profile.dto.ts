import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { AvatarFileDTO } from './avatar-file.dto';
import { ProfileDTO } from './profile.dto';
import { UpdateProfileRequestInput } from '../types';

class ProfilePart extends PickType(ProfileDTO, ['name', 'surname']) {}

export class UpdateProfileDTO
  extends PartialType(IntersectionType(ProfilePart, AvatarFileDTO))
  implements UpdateProfileRequestInput {}
