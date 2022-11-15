import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ReadableUserDto } from './dto/readableUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'All users' })
  @ApiResponse({
    status: 200,
    type: [ReadableUserDto],
  })
  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }
}
