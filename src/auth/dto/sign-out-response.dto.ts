import { SignOutResponse } from '../auth.interface';
import { UserIdDTO } from 'src/user/dto/params.dto';

export class SignOutResponseDTO extends UserIdDTO implements SignOutResponse {}
