import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthorModule } from './author/author.module';
import { AuthModule } from './auth/auth.module';

import { PostModule } from './post/post.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/auth.guard';
import { TokenBlacklistModule } from './auth/token-blacklist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly specify the .env file path
    }),
    PrismaModule,
    AuthorModule,
    AuthModule,
    PostModule,
    TokenBlacklistModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Use globally
    },
  ],
})
export class AppModule {}
