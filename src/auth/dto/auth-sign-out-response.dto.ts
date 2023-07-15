import { AuthSignOutResponse } from '../types';
import { UserIdDTO } from 'src/user/dto/params.dto';

export class AuthSignOutResponseDTO
  extends UserIdDTO
  implements AuthSignOutResponse {}
