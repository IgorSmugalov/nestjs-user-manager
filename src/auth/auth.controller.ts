import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { LoginResultDTO } from './dto/login-result.dto';
import { Response } from 'express';
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

  @UseRefreshJwtGuard()
  @Post('logout')
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.clearauthCookie(res);
    return user;
  }
}
