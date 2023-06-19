import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { JWTPayload } from 'jose';
import { v4 as uuidv4 } from 'uuid';

export type RegisteredJwtClaims = Required<
  Pick<JWTPayload, 'exp' | 'jti' | 'iat'>
>;

export class RegisteredJwtClaimsDTO implements RegisteredJwtClaims {
  @ApiProperty()
  @Expose()
  @IsString()
  jti: string = uuidv4();

  @ApiProperty()
  @Expose()
  @IsNumber()
  exp: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  iat: number;
}
