import { Injectable, NestMiddleware } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request, Response } from 'express';
import { JwtService } from '../jwt.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: () => void) {
    const authorizationHeader = req.headers.authorization;
    req.user = null;
    if (!authorizationHeader) return next();
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !isJWT(token)) return next();
    req.user = await this.jwtService.jwtVerify(token);
    return next();
  }
}
