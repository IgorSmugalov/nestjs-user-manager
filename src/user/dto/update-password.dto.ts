import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { Expose } from 'class-transformer';
import { IsStrongPassword } from 'class-validator';
import { UpdatePassword } from '../user.types';

export class UpdatePasswordDTO
  extends PickType(UserDTO, ['password'])
  implements UpdatePassword
{
  @Expose()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 0,
  })
  @ApiProperty()
  newPassword: string;
}
