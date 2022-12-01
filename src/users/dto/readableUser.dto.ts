import { ApiProperty } from '@nestjs/swagger';

export class ReadableUserDto {
  @ApiProperty({ example: 1, description: 'User id' })
  id: number;

  @ApiProperty({ example: 'login', description: 'User login' })
  login: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODUxZDVmNjc4YzY2YjQwOTU5Yzk3YiIsImxvZ2luIjoidGVzdF9fbG9naW4iLCJpYXQiOjE2Njk4Nzk2NTcsImV4cCI6MTY2OTk2NjA1N30.MVedqfkFO9hwIlxDgd0mpwxWuZFlYukF2wWxsq7XaXc',
    description: 'auth token',
  })
  token: string;
}

export class ReadableUserWithTokenDto {
  id: number;
  login: string;
  token: string;
}
