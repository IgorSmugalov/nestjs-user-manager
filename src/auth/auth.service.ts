import { Injectable } from '@nestjs/common';
import { CredentialsDTO } from './dto/credentials.dto';
import { HashService } from 'src/crypto/hash.service';
import {
  IncorrectCredentialsException,
  UserNotActivatedException,
  UserUnauthorizedException,
} from './auth.exceptions';
import { Request, Response } from 'express';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { UserService } from 'src/user/user.service';
import { TokensDTO } from './dto/auth-data.dto';
import { ProfileService } from 'src/profile/profile.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly hashService: HashService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
  ) {}

  public async authByCredentials(userCredentials: CredentialsDTO) {
    const { email, password } = userCredentials;
    let user: User | null;
    try {
      user = await this.userService.getUnique({ email });
      await this.hashService.validatePassword(user.password, password, {
        throwOnFail: true,
      });
    } catch {
      throw new IncorrectCredentialsException();
    }
    this.isCanAuth(user);
    const profile = await this.profileService.getById({
      id: user.userProfileId,
    });
    const accessToken = await this.accessJwtService.signJwt(user, profile);
    const refreshToken = await this.refreshJwtService.signJwt(user);
    return new TokensDTO({ accessToken, refreshToken });
  }

  public async authByRefreshToken(userClaims: RefreshJwtClaimsDTO) {
    const user = await this.userService.getUnique({ id: userClaims.id });
    if (!user) throw new UserUnauthorizedException();
    const profile = await this.profileService.getById({
      id: user.userProfileId,
    });
    this.isCanAuth(user);
    await this.refreshJwtService.removeJwtFromWhitelist(userClaims);
    const accessToken = await this.accessJwtService.signJwt(user, profile);
    const refreshToken = await this.refreshJwtService.signJwt(user);
    return new TokensDTO({ accessToken, refreshToken });
  }

  public async logout(user: RefreshJwtClaimsDTO) {
    await this.refreshJwtService.removeJwtFromWhitelist(user);
    return;
  }

  public setAuthCookie(response: Response, refreshToken: string) {
    response.cookie('refresh', refreshToken, {
      httpOnly: true,
      path: '/auth/',
    });
  }

  public getAuthCookie(request: Request): string {
    return request.cookies.refresh;
  }

  public clearAuthCookie(response: Response) {
    return response.clearCookie('refresh', {
      httpOnly: true,
      path: '/auth/',
    });
  }

  private isCanAuth(user: User): boolean {
    if (!user.activated) throw new UserNotActivatedException();
    return true;
  }
}
