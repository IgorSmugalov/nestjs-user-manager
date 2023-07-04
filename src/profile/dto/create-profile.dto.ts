import { PickType } from '@nestjs/swagger';
import { CreateProfileInput } from '../types';
import { ProfileDTO } from './profile.dto';

export class CreateProfileDTO
  extends PickType(ProfileDTO, ['name', 'surname'])
  implements CreateProfileInput {}
