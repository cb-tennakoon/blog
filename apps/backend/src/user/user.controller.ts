import { Controller, UseGuards, Get, Req } from '@nestjs/common';


@Controller('user')
export class UserController {
  @Get('profile')
  getProfile(@Req() request: Request) {
    return { user: request['user'], message: 'Protected user profile' };
  }
}
