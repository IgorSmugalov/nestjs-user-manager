import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/user-credentials.dto';
import { User } from './decorators/user.decorator';
import { AccessJwtPayloadDTO } from './dto/access-jwt-payload.dto';
import { UseJwtAuthGuard } from './decorators/use-jwt-auth-guard.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<any> {
    return await this.authService.registerUser(userCredentialsDTO);
  }

  @Post('login')
  async loginUser(
    @Body() userCredentialsDTO: UserCredentialsDTO,
  ): Promise<any> {
    return await this.authService.loginUserByCredentials(userCredentialsDTO);
  }

  // Example & test
  @UseJwtAuthGuard()
  @Post('access-jwt-guard/')
  async checkAuthGuard(@User() user: AccessJwtPayloadDTO): Promise<any> {
    return user;
  }
}
