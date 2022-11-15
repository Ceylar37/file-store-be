import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  getHi() {
    return 'Hello world';
  }
}
