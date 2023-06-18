import { Injectable } from '@nestjs/common';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/crypto/hash.service';
import { UserAuthData } from '@prisma/client';
import { JwtService } from './jwt.service';
import {
  IncorrectCredentials,
  UserAlreadyExiststException,
} from './auth.exceptions';
import { LoginResultDTO } from './dto/login-result.dto';

export interface Tokens {
  accessJwt: string;
}

export interface TokensPayloads {
  accessJwtPayload: AccessTokenPayload;
}

export type AccessTokenPayload = Pick<
  UserAuthData,
  'id' | 'email' | 'activated' | 'userProfileId'
>;

export type RefreshTokenPayload = Pick<UserAuthData, 'id' | 'email'>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) {}

  public async registerUser(
    userCredentials: UserCredentialsDTO,
  ): Promise<LoginResultDTO> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
    if (existingUser) throw new UserAlreadyExiststException();
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = await this.prisma.userAuthData.create({
      data: { email, password: hashedPassword, userProfile: { create: {} } },
    });
    const accessToken = await this.jwtService.signAccessJWT(newUser);
    return new LoginResultDTO({ accessToken });
  }

  public async loginByCredentials(
    userCredentials: UserCredentialsDTO,
  ): Promise<LoginResultDTO> {
    const { email, password } = userCredentials;
    const candidate = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
    const isPassValid = await this.hashService.validatePassword(
      candidate.password,
      password,
    );
    if (!candidate || !isPassValid) {
      throw new IncorrectCredentials();
    }
    const accessToken = await this.jwtService.signAccessJWT(candidate);
    return new LoginResultDTO({ accessToken });
  }

  public async check(token: string) {
    return await this.jwtService.jwtVerify(token);
  }
}
