import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ProfileService } from '../profile.service';

@Injectable()
export class DefineAvatarURNInterceptor implements NestInterceptor {
  constructor(private readonly profileService: ProfileService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (value.avatar) {
          value.avatar = this.profileService.defineAvatarURN(value.avatar);
        }
        return value;
      }),
    );
  }
}
