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
    try {
      const authHeader = req.headers.authorization;
      const [bearer, token] = authHeader.split(' ');

      if (!token || bearer !== 'Bearer')
        throw new UnauthorizedException('User not authorized');

      const tokenData = this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });
      const user = await this.usersService.findOne(tokenData.id);
      if (user.token !== token)
        throw new UnauthorizedException('User not authorized');

      if (Date.now() / 1000 > +tokenData.exp)
        throw new UnauthorizedException('Auth expired');
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('User not authorized');
    }
  }
}
