import { IntersectionType, PickType } from '@nestjs/swagger';
import { RegisteredJwtClaimsDTO } from './jwt-claims-registered.dto';
import { AccessJwtClaims } from '../auth.interface';
import { Expose, plainToInstance } from 'class-transformer';
import { JWTPayload } from 'jose';
import { ProfileDTO } from 'src/profile/dto/profile.dto';
import { Profile, User } from '@prisma/client';
import { UserDTO } from 'src/user/dto/user.dto';

class PartialProfileEntity extends PickType(ProfileDTO, [
  'id',
  'name',
  'surname',
]) {}

class PartialUserEntity extends PickType(UserDTO, [
  'id',
  'activated',
  'roles',
]) {}

class PartialRegisteredClaims extends PickType(RegisteredJwtClaimsDTO, [
  'exp',
  'iat',
]) {}

export class AccessJwtClaimsDTO
  extends IntersectionType(
    PartialUserEntity,
    PartialRegisteredClaims,
    PartialRegisteredClaims,
  )
  implements AccessJwtClaims
{
  @Expose()
  userProfile: PartialProfileEntity;

  static fromUser(user: User, profile: Profile): AccessJwtClaimsDTO {
    return plainToInstance(
      this,
      { ...user, userProfile: profile },
      {
        strategy: 'excludeAll',
        exposeUnsetFields: false,
        exposeDefaultValues: true,
        enableImplicitConversion: true,
      },
    );
  }

  static fromToken(jwt: JWTPayload) {
    return plainToInstance(this, jwt, {
      strategy: 'excludeAll',
      exposeDefaultValues: false,
      enableImplicitConversion: true,
    });
  }
}
