import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthorService } from 'author/author.service';
import {
  AuthorResponseDto,
  LoginAuthorDto,
  LoginResponseDto,
} from 'author/dto/author.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authorService: AuthorService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthorDto: LoginAuthorDto): Promise<LoginResponseDto> {
    console.log(
      `Login attempt with emailOrUsername: ${loginAuthorDto.emailOrUsername}`,
    );
    const author = await this.authorService.findByEmailOrUsername(
      loginAuthorDto.emailOrUsername,
    );
    if (!author) {
      console.log(
        `Author not found for emailOrUsername: ${loginAuthorDto.emailOrUsername}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthorDto.password,
      author.passwordHash,
    );
    if (!isPasswordValid) {
      console.log(
        `Invalid password for emailOrUsername: ${loginAuthorDto.emailOrUsername}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`Login successful for authorId: ${author.authorId}`);

    const payload = {
      sub: author.authorId,
      username: author.username,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      author: {
        authorId: author.authorId,
        username: author.username,
        email: author.email,
        firstName: author.firstName,
        lastName: author.lastName,
        roleId: author.roleId,
        createdAt: author.createdAt,
      },
    };
  }
}
