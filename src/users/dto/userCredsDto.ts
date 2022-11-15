import { ApiProperty } from '@nestjs/swagger';

export class UserCredsDto {
  @ApiProperty({ example: 'login', description: 'Логин пользователя' })
  login: string;

  @ApiProperty({ example: 'password', description: 'Пароль' })
  password: string;
}
