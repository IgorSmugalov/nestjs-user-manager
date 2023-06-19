import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User } from './decorators/user.decorator';
import { LoginResultDTO } from './dto/login-result.dto';
import { UseAccessJwtGuard } from './decorators/use-access-jwt-guard.decorator';
import { Response } from 'express';
import { AccessJwtClaimsDTO } from './dto/access-jwt-claims.dto';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { UseRefreshJwtGuard } from './decorators/use-refresh-jwt-guard.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';

@Controller('auth')
@UseRequestValidation()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<LoginResultDTO> {
    return await this.authService.registerUser(userCredentialsDTO);
  }

  @Post('login')
  async loginUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResultDTO> {
    const tokens = await this.authService.authByCredentials(userCredentialsDTO);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return tokens;
  }

  @UseRefreshJwtGuard()
  @Post('refresh')
  async refreshTokens(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.authByRefreshToken(user);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return tokens;
  }

  // Example & test
  @UseAccessJwtGuard()
  @Post('access-jwt/')
  async checkAuthGuard(@User() user: AccessJwtClaimsDTO): Promise<any> {
    return user;
  }

  // Example & test
  @UseRefreshJwtGuard()
  @Post('refresh-jwt/')
  async checkRefreshToken(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
  ): Promise<any> {
    return user;
  }
}
