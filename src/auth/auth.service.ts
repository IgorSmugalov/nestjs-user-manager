import { Injectable } from '@nestjs/common';
import { CredentialsDTO } from './dto/credentials.dto';
import { HashService } from 'src/crypto/hash.service';
import {
  IncorrectCredentialsException,
  UserUnauthorizedException,
} from './auth.exceptions';
import { Request, Response } from 'express';
import { AccessJwtService } from './access-jwt.service';
import { RefreshJwtService } from './refresh-jwt.service';
import { RefreshJwtClaimsDTO } from './dto/jwt-claims-refresh.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserAndProfileDTO } from 'src/user/dto/create-user-and-profile.dto';
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

  public async registerUser(createDto: CreateUserAndProfileDTO) {
    createDto.password = await this.hashService.hashPassword(
      createDto.password,
    );
    const user = await this.userService.createUserAndProfile(createDto);
    const profile = await this.profileService.getProfile({
      id: user.userProfileId,
    });
    const accessToken = await this.accessJwtService.signJwt(user, profile);
    const refreshToken = await this.refreshJwtService.signJwt(user);
    return new TokensDTO({ accessToken, refreshToken });
  }

  public async authByCredentials(userCredentials: CredentialsDTO) {
    const { password, email } = userCredentials;
    let user: undefined | User;
    try {
      user = await this.userService.getUser(
        {
          email,
        },
        { throwOnNotFound: true },
      );
      await this.hashService.validatePassword(user.password, password, true);
    } catch {
      throw new IncorrectCredentialsException();
    }
    const profile = await this.profileService.getProfile({
      id: user.userProfileId,
    });
    const accessToken = await this.accessJwtService.signJwt(user, profile);
    const refreshToken = await this.refreshJwtService.signJwt(user);
    return new TokensDTO({ accessToken, refreshToken });
  }

  public async authByRefreshToken(user: RefreshJwtClaimsDTO) {
    const chekedUser = await this.userService.getUser({ id: user.id });
    if (!chekedUser) throw new UserUnauthorizedException();
    const profile = await this.profileService.getProfile({
      id: chekedUser.userProfileId,
    });

    const accessToken = await this.accessJwtService.signJwt(
      chekedUser,
      profile,
    );
    const refreshToken = await this.refreshJwtService.signJwt(chekedUser);
    return new TokensDTO({ accessToken, refreshToken });
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
}
