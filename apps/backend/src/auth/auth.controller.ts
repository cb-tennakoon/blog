import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { TokenBlacklistService } from './token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,

  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')?.[1];
    this.tokenBlacklistService.addToBlacklist(token);
    return { message: 'Logged out successfully' };
  }
}
