import { Injectable } from '@nestjs/common';
import { CredentialsDTO } from './dto/credentials.dto';
import { HashService } from 'src/crypto/hash.service';
import {
  IncorrectCredentialsException,
  IncorrectRefreshTokenException,
  UserNotActivatedException,
} from './auth.exceptions';
import { Request, Response } from 'express';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { UserService } from 'src/user/user.service';
import { TokensDTO } from './dto/tokens.dto';
import { ProfileService } from 'src/profile/profile.service';
import { User } from '@prisma/client';
import { Tokens } from './auth.interface';
import { UserId } from 'src/user/user.types';
import { REFRESH_COOKIE_KEY, REFRESH_COOKIE_PATH } from './auth.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly hashService: HashService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
  ) {}

  /**
   * SignIn by login and password
   * @param {CredentialsDTO} userCredentials
   * @returns {Promise<Tokens>}
   * @throws {IncorrectCredentialsException, UserNotActivatedException}
   */
  public async authByCredentials(
    userCredentials: CredentialsDTO,
  ): Promise<Tokens> {
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

  /**
   * SignIn by refresh token
   * @param {RefreshJwtClaimsDTO} userClaims
   * @returns {Promise<Tokens>}
   * @throws {IncorrectRefreshTokenException, UserNotActivatedException}
   */
  public async authByRefreshToken(
    userClaims: RefreshJwtClaimsDTO,
  ): Promise<Tokens> {
    let user: User | null;
    try {
      user = await this.userService.getUnique({ id: userClaims.id });
    } catch {
      throw new IncorrectRefreshTokenException();
    }
    const profile = await this.profileService.getById({
      id: user.userProfileId,
    });
    this.isCanAuth(user);
    await this.refreshJwtService.removeJwtFromWhitelist(userClaims);
    const accessToken = await this.accessJwtService.signJwt(user, profile);
    const refreshToken = await this.refreshJwtService.signJwt(user);
    return new TokensDTO({ accessToken, refreshToken });
  }

  /**
   * SignOut
   * Remove stored in whitelist refresh token
   * @param {RefreshJwtClaimsDTO} userClaims
   * @returns {Promise<UserId>}
   */
  public async logout(userClaims: RefreshJwtClaimsDTO): Promise<UserId> {
    const result = await this.refreshJwtService.removeJwtFromWhitelist(
      userClaims,
    );
    return { id: result.UserId };
  }

  public setAuthCookie(response: Response, refreshToken: string) {
    response.cookie(REFRESH_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      path: REFRESH_COOKIE_PATH,
    });
  }

  public getAuthCookie(request: Request): string {
    return request.cookies.refresh;
  }

  public clearAuthCookie(response: Response) {
    return response.clearCookie(REFRESH_COOKIE_KEY, {
      httpOnly: true,
      path: REFRESH_COOKIE_PATH,
    });
  }

  private isCanAuth(user: User): boolean {
    if (!user.activated) throw new UserNotActivatedException();
    return true;
  }
}
