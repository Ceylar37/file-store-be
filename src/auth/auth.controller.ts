import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserCredsDto } from '../users/dto/userCredsDto';
import { ReadableUserDto } from '../users/dto/readableUser.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async singUp(
    @Res({ passthrough: true }) res,
    @Body() dto: UserCredsDto,
  ): Promise<ReadableUserDto> {
    const userData = await this.authService.signUp(dto);
    res.cookie('token', userData.token, { httpOnly: true });
    return {
      login: userData.login,
      id: userData.id,
    };
  }

  @Post('signIn')
  async singIn(
    @Res({ passthrough: true }) res,
    @Body() dto: UserCredsDto,
  ): Promise<ReadableUserDto> {
    console.log(dto);
    const userData = await this.authService.signIn(dto);
    res.cookie('token', userData.token, { httpOnly: true });
    return {
      login: userData.login,
      id: userData.id,
    };
  }
}
