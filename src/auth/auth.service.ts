import { Injectable } from '@nestjs/common';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/crypto/hash.service';
import {
  IncorrectCredentialsException,
  UserAlreadyExiststException,
  UserUnauthorizedException,
} from './auth.exceptions';
import { Request, Response } from 'express';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { ITokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
    private readonly accessJwtService: AccessJwtService,
    private readonly refreshJwtService: RefreshJwtService,
  ) {}

  public async registerUser(
    userCredentials: UserCredentialsDTO,
  ): Promise<ITokens> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
    if (existingUser) throw new UserAlreadyExiststException();
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = await this.prisma.userAuthData.create({
      data: { email, password: hashedPassword, userProfile: { create: {} } },
    });
    const accessToken = await this.accessJwtService.signJwt(newUser);
    const refreshToken = await this.refreshJwtService.signJwt(newUser);
    return { accessToken, refreshToken };
  }

  public async authByCredentials(
    userCredentials: UserCredentialsDTO,
  ): Promise<ITokens> {
    const { email, password } = userCredentials;
    const candidate = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
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

  public async authByRefreshToken(user: RefreshJwtClaimsDTO): Promise<ITokens> {
    const chekedUser = await this.prisma.userAuthData.findUnique({
      where: { id: user.id },
    });
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
}
