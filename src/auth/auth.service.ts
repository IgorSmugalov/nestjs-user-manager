import { Injectable } from '@nestjs/common';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { HashService } from 'src/crypto/hash.service';
import {
  IncorrectCredentialsException,
  UserUnauthorizedException,
} from './auth.exceptions';
import { Request, Response } from 'express';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { ITokensSet } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
  ) {}

  public async registerUser({
    email,
    password,
  }: UserCredentialsDTO): Promise<ITokensSet> {
    password = await this.hashService.hashPassword(password);
    const newUser = await this.userService.createUser({
      email,
      password,
    });
    const accessToken = await this.accessJwtService.signJwt(newUser);
    const refreshToken = await this.refreshJwtService.signJwt(newUser);
    return { accessToken, refreshToken };
  }

  public async authByCredentials(
    userCredentials: UserCredentialsDTO,
  ): Promise<ITokensSet> {
    const { email, password } = userCredentials;
    const candidate = await this.userService.getUserByEmail({ email });
    if (!candidate) {
      throw new IncorrectCredentialsException();
    }
    const isPassValid = await this.hashService.validatePassword(
      candidate.password,
      password,
    );
    if (!isPassValid) {
      throw new IncorrectCredentialsException();
    }
    const accessToken = await this.accessJwtService.signJwt(candidate);
    const refreshToken = await this.refreshJwtService.signJwt(candidate);
    return { accessToken, refreshToken };
  }

  public async authByRefreshToken(
    user: RefreshJwtClaimsDTO,
  ): Promise<ITokensSet> {
    const chekedUser = await this.userService.getUserById({ id: user.id });
    if (!chekedUser) throw new UserUnauthorizedException();
    const accessToken = await this.accessJwtService.signJwt(chekedUser);
    const refreshToken = await this.refreshJwtService.signJwt(chekedUser);
    return { accessToken, refreshToken };
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

  public clearauthCookie(response: Response) {
    return response.clearCookie('refresh');
  }

  // private getUserByEmail(email: string) {

  // }
}
