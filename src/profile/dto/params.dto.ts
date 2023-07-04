import { PickType as PT } from '@nestjs/swagger';
import { ProfileId } from '../types';
import { ProfileDTO } from './profile.dto';

export class ProfileIdDTO extends PT(ProfileDTO, ['id']) implements ProfileId {}
