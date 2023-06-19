import { Injectable, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request, Response } from 'express';
import { RefreshJwtService } from '../refresh-jwt.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly refreshJwtService: RefreshJwtService,
    private readonly authService: AuthService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    req.refreshedUser = null;
    const refreshCookie = this.authService.getAuthCookie(req);
    if (!refreshCookie || !isJWT(refreshCookie)) return next();
    req.refreshedUser = await this.refreshJwtService.verifyJwt(refreshCookie);
    return next();
  }
}
