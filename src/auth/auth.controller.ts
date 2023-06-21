import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { AuthResponseDTO } from './dto/auth-result.dto';
import { Response } from 'express';
import { UseRequestValidation } from 'src/utils/validation/use-request-validation.decorator';
import { UseRefreshJwtGuard } from './decorators/use-refresh-jwt-guard.decorator';
import { RefreshedUser } from './decorators/refreshed-user.decorator';
import { RefreshJwtClaimsDTO } from './dto/refresh-jwt-claims.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
@UseRequestValidation()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: UserCredentialsDTO })
  @ApiCreatedResponse({ type: AuthResponseDTO })
  async registerUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDTO> {
    const tokens = await this.authService.registerUser(userCredentialsDTO);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return new AuthResponseDTO(tokens);
  }

  @Post('login')
  @ApiBody({ type: UserCredentialsDTO })
  @ApiCreatedResponse({ type: AuthResponseDTO })
  async loginUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDTO> {
    const tokens = await this.authService.authByCredentials(userCredentialsDTO);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return new AuthResponseDTO(tokens);
  }

  @Post('refresh')
  @UseRefreshJwtGuard()
  @ApiCreatedResponse({ type: AuthResponseDTO })
  async refreshTokens(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDTO> {
    const tokens = await this.authService.authByRefreshToken(user);
    this.authService.setAuthCookie(res, tokens.refreshToken);
    return new AuthResponseDTO(tokens);
  }

  @Post('logout')
  @UseRefreshJwtGuard()
  async logout(
    @RefreshedUser() user: RefreshJwtClaimsDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.authService.clearauthCookie(res);
    return;
  }
}
