import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserCredsDto } from '../users/dto/userCredsDto';
import { ReadableUserWithTokenDto } from '../users/dto/readableUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(data) {
    return this.jwtService.sign(data, {
      secret: process.env.SECRET,
      expiresIn: '1d',
    });
  }

  async signUp(dto: UserCredsDto): Promise<ReadableUserWithTokenDto> {
    const userFromDB = await this.usersService.findByLogin(dto.login);
    if (userFromDB) {
      throw new HttpException(
        'User with this login already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 6);
    const createdUser = await this.usersService.create({
      login: dto.login,
      password: hashPassword,
    });
    console.log('createdUser', createdUser);

    const tokenPayload = {
      id: createdUser.id,
      login: createdUser.login,
    };
    const token = await this.generateToken(tokenPayload);
    await this.usersService.updateToken({ userId: createdUser.id, token });
    return {
      id: createdUser.id,
      login: createdUser.login,
      token,
    };
  }

  async signIn(dto: UserCredsDto): Promise<ReadableUserWithTokenDto> {
    const user = await this.usersService.findByLogin(dto.login);
    console.log(user);
    if (!user)
      throw new HttpException(
        'Invalid user or password',
        HttpStatus.BAD_REQUEST,
      );

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new HttpException(
        'Invalid user or password',
        HttpStatus.BAD_REQUEST,
      );

    const tokenPayload = {
      id: user.id,
      login: user.login,
    };
    const token = await this.generateToken(tokenPayload);
    await this.usersService.updateToken({ userId: user.id, token });

    return {
      id: user.id,
      login: user.login,
      token,
    };
  }
}
