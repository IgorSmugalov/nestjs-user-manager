import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tokens } from '../auth.interface';

export class TokensDTO implements Tokens {
  constructor(data: Tokens) {
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }

  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
