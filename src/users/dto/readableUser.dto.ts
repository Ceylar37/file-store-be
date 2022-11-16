import { ApiProperty } from '@nestjs/swagger';

export class ReadableUserDto {
  @ApiProperty({ example: 1, description: 'User id' })
  id: number;

  @ApiProperty({ example: 'login', description: 'User login' })
  login: string;
}

export class ReadableUserWithTokenDto {
  id: number;
  login: string;
  token: string;
}
