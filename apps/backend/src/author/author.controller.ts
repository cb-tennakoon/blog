import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from '@prisma/client';
import {
  AuthorResponseDto,
  AuthorResponseDtoWithID,
  CreateAuthorDto,
} from './dto/author.dto';
import { AuthGuard } from 'auth/auth.guard';
import { Public } from 'auth/public.decorator';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}


  //get all authors
  @Get()
  async findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }
  @Get(':authorId')
  async findOne(
    @Param('authorId') authorId: string,
  ): Promise<AuthorResponseDtoWithID | null> {
    return this.authorService.findOne(parseInt(authorId, 10));
  }
  //register author
  @Post('register')
  @Public()
  async create(
    @Body() createAuthorDto: CreateAuthorDto,
  ): Promise<AuthorResponseDto> {
    return this.authorService.create(createAuthorDto);
  }
  @Get('registerUsers')
  registerUsers(): string {
    return 'hello Author';
  }
}
