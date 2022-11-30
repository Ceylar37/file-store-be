import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(req.cookies);
    try {
      if (!req.cookies.token)
        throw new UnauthorizedException('User not authorized');

      const tokenData = this.jwtService.verify(req.cookies.token, {
        secret: process.env.SECRET,
      });
      const user = await this.usersService.findOne(tokenData.id);
      if (user.token !== req.cookies.token)
        throw new UnauthorizedException('User not authorized');

      if (Date.now() / 1000 > +tokenData.exp)
        throw new UnauthorizedException('Auth expired');

      return true;
    } catch (e) {
      throw new UnauthorizedException('User not authorized');
    }
  }
}
