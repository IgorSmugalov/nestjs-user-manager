import { ApiProperty } from '@nestjs/swagger';
import { ProfileId } from '../types';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ProfileIdDTO implements ProfileId {
  @IsUUID(4)
  @Expose()
  @ApiProperty()
  id: string;
}
