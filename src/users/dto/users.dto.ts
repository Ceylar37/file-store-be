import { UserCredsDto } from './userCredsDto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends UserCredsDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  token: string;
}
