import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { Author } from '@prisma/client';
import {
  AuthorProfileDto,
  AuthorProfileDtoForUpdate,
  AuthorResponseDto,
  AuthorResponseDtoWithID,
  AuthorUpdateProfileByAuthorDto,
  CreateAuthorDto,
} from './dto/author.dto';
import { AuthGuard } from 'auth/auth.guard';
import { Public } from 'auth/public.decorator';
import { CurrentUser } from 'auth/current-user.decorator';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}


  //get all authors
  @Get()
  async findAll(): Promise<Author[]> {
    return this.authorService.findAll();
  }
  //logged user details
  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<AuthorProfileDto> {
    if (!user?.sub) {
      throw new NotFoundException('User ID not found in token');
    }
    console.log(`Getting profile for user.sub: ${user.sub}`);
    const authorId = parseInt(user.sub, 10);
    const author = await this.authorService.getProfile(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }
  // Update logged-in user's profile
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateAuthorDto: AuthorUpdateProfileByAuthorDto,
  ): Promise<AuthorProfileDtoForUpdate> {
    if (!user?.sub) {
      console.error('No user.sub found in token:', user);
      throw new NotFoundException('User ID not found in token');
    }
    const authorId = parseInt(user.sub, 10);
    if (isNaN(authorId)) {
      console.error(`Invalid user.sub: ${user.sub}`);
      throw new NotFoundException('Invalid user ID in token');
    }
    console.log(`Updating profile for authorId: ${authorId}`);
    return this.authorService.updateProfile(authorId, updateAuthorDto);
  }
  // Get a specific author by ID
  @Get(':authorId')
  async findOne(
    @Param('authorId') authorId: string,
  ): Promise<AuthorResponseDtoWithID | null> {
    const id = parseInt(authorId, 10);
    if (!authorId || isNaN(id)) {
      console.error(`Invalid authorId in findOne: ${authorId}`);
      throw new NotFoundException('Invalid author ID');
    }
    console.log(`Fetching author with ID: ${id}`);
    return this.authorService.findOne(id);
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
