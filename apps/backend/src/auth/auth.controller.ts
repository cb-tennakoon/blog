import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthorResponseDto,
  LoginAuthorDto,
  LoginResponseDto,
} from 'author/dto/author.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { TokenBlacklistService } from './token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('login')
  @Public()
  async login(
    @Body() loginAuthorDto: LoginAuthorDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginAuthorDto);
  }
  @Post('logout')
  logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')?.[1];
    this.tokenBlacklistService.addToBlacklist(token);
    console.log('Logged out successfully');
    return { message: 'Logged out successfully' };
  }
}
