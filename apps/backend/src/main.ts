import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from './auth/token-blacklist.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(
    new AuthGuard(
      app.get(JwtService),
      app.get(ConfigService),
      app.get(Reflector),
      app.get(TokenBlacklistService)
    ),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
