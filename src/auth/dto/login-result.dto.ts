import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

interface LoginResultArgs {
  accessToken: string;
}

export class LoginResultDTO {
  constructor(data: LoginResultArgs) {
    Object.assign(this, data);
  }
  @Expose()
  @ApiProperty()
  accessToken: string;
}
