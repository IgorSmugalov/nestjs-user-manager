import { PickType } from '@nestjs/swagger';
import { SignInResponse } from '../auth.interface';
import { TokensDTO } from './tokens.dto';

export class SignInResponseDTO
  extends PickType(TokensDTO, ['accessToken'])
  implements SignInResponse {}
