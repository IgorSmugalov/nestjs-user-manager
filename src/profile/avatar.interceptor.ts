import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable()
export class AvatarInterceptor implements NestInterceptor {
  constructor(private profileService: ProfileService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.body.avatar = req.file;
    return next.handle().pipe();
  }
}
