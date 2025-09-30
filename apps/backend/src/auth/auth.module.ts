import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthorModule } from 'author/author.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { TokenBlacklistService } from './token-blacklist.service';
@Module({
  imports: [AuthorModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    TokenBlacklistService,
    AuthGuard,
  ],
  exports: [AuthService, TokenBlacklistService],
})
export class AuthModule {}
