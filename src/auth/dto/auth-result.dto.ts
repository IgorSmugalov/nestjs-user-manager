import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ITokensSet } from '../types';

export class AuthResponseDTO {
  constructor(data: ITokensSet) {
    this.accessToken = data.accessToken;
  }
  @Expose()
  @ApiProperty()
  public readonly accessToken: string;
}
