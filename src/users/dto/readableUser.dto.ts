import { ApiProperty } from '@nestjs/swagger';

export class ReadableUserDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'login', description: 'Логин пользователя' })
  login: string;
}

export class ReadableUserWithTokenDto {
  id: number;
  login: string;
  token: string;
}
