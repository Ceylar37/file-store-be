import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserCredsDto } from '../users/dto/userCredsDto';
import { ReadableUserDto } from '../users/dto/readableUser.dto';
import { HttpBadRequest } from '../swagger.types';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: ReadableUserDto })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: HttpBadRequest,
  })
  @Post('signUp')
  async singUp(
    @Res({ passthrough: true }) res,
    @Body() dto: UserCredsDto,
  ): Promise<ReadableUserDto> {
    const userData = await this.authService.signUp(dto);
    // res.cookie('token', userData.token, { httpOnly: true });
    return {
      login: userData.login,
      id: userData.id,
      token: userData.token,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, type: ReadableUserDto })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: HttpBadRequest,
  })
  @Post('signIn')
  async singIn(
    @Req() req,
    @Res({ passthrough: true }) res,
    @Body() dto: UserCredsDto,
  ): Promise<ReadableUserDto> {
    const userData = await this.authService.signIn(dto);
    // res.cookie('token', userData.token, { httpOnly: true });
    return {
      login: userData.login,
      id: userData.id,
      token: userData.token,
    };
  }
}
