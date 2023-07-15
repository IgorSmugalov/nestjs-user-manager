import { PickType } from '@nestjs/swagger';
import { AuthSignInResponse } from '../types';
import { TokensDTO } from './tokens.dto';

export class AuthSignInResponseDTO
  extends PickType(TokensDTO, ['accessToken'])
  implements AuthSignInResponse {}
