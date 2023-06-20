import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ITokensSet } from '../types';

export class AuthResultDTO {
  constructor(data: ITokensSet) {
    Object.assign(this, data);
  }
  @Expose()
  @ApiProperty()
  accessToken: string;
}
