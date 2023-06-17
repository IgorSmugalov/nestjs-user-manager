import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/crypto/hash.service';
import { UserAuthData } from '@prisma/client';
import { JwtService } from './jwt.service';

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
    private hash: HashService,
    private jwt: JwtService,
  ) {}

  //TODO: Return login data
  public async registerUser(userCredentials: UserCredentialsDTO): Promise<any> {
    const { email, password } = userCredentials;
    const existingUser = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('User Exists'); //TODO: Rework exception
    const hashedPassword = await this.hash.hashPassword(password);
    const newUser = await this.prisma.userAuthData.create({
      data: { email, password: hashedPassword, userProfile: { create: {} } },
    });
    const accessJwt = await this.jwt.signAccessJWT(newUser);
    return { accessJwt };
  }

  //TODO: Return login data
  public async loginUserByCredentials(
    userCredentials: UserCredentialsDTO,
  ): Promise<any> {
    const { email, password } = userCredentials;
    const candidate = await this.prisma.userAuthData.findUnique({
      where: { email },
    });
    const isPassValid = await this.hash.validatePassword(
      candidate.password,
      password,
    );
    if (!candidate || !isPassValid) {
      throw new BadRequestException('Login failed'); //TODO: Rework exception
    }
    const accessJwt = await this.jwt.signAccessJWT(candidate);
    return { accessJwt };
  }

  public async check(token: string) {
    return await this.jwt.jwtVerify(token);
  }
}
