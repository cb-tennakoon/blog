import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Posts } from '@prisma/client';
import { Public } from 'auth/public.decorator';
import { CreatePostDto, PostResponseDto } from './dto/create-post.dto';
import { AuthGuard } from 'auth/auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'auth/current-user.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}
  // GET /posts?status=published
  @Get('all')
  async findAll(@Query('status') status?: string): Promise<Posts[]> {
    return this.postsService.findAll(status);
  }
  @Get()
  async findAllPostOfAuthor(
    @Query('status') status: string | undefined,
    @CurrentUser() user: any,
  ): Promise<Posts[]> {
    return this.postsService.findAllPostOfAuthor(status, user.sub);
  }
  // Create a new post
  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    if (!user?.sub) {
      console.error('No user.sub found in token:', user);
      throw new NotFoundException('User ID not found in token');
    }
    const authorId = parseInt(user.sub, 10);
    if (isNaN(authorId)) {
      console.error(`Invalid user.sub: ${user.sub}`);
      throw new NotFoundException('Invalid user ID in token');
    }
    console.log(`Creating post for authorId: ${authorId}`);
    return this.postsService.create(authorId, createPostDto);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
    if (!user?.sub) {
      console.error('No user.sub found in token:', user);
      throw new NotFoundException('User ID not found in token');
    }
    const authorId = parseInt(user.sub, 10);
    if (isNaN(authorId)) {
      console.error(`Invalid user.sub: ${user.sub}`);
      throw new NotFoundException('Invalid user ID in token');
    }
    console.log(`Fetching post with id: ${id} for authorId: ${authorId}`);
    return this.postsService.findOne(id, authorId);
  }
  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    if (!user?.sub) {
      console.error('No user.sub found in token:', user);
      throw new NotFoundException('User ID not found in token');
    }
    const authorId = parseInt(user.sub, 10);
    if (isNaN(authorId)) {
      console.error(`Invalid user.sub: ${user.sub}`);
      throw new NotFoundException('Invalid user ID in token');
    }
    console.log(`Updating post with id: ${id} for authorId: ${authorId}`);
    return this.postsService.update(id, authorId, updatePostDto);
  }
  @Delete(':id')
  async delete(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    if (!user?.sub) {
      console.error('No user.sub found in token:', user);
      throw new NotFoundException('User ID not found in token');
    }
    const authorId = parseInt(user.sub, 10);
    if (isNaN(authorId)) {
      console.error(`Invalid user.sub: ${user.sub}`);
      throw new NotFoundException('Invalid user ID in token');
    }
    console.log(`Deleting post with id: ${id} for authorId: ${authorId}`);
    return this.postsService.delete(id, authorId);
  }
  // GET /posts/:id
  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<Posts> {
  //   const post = await this.postsService.findById(Number(id));
  //   if (!post) {
  //     throw new NotFoundException(`Post with ID ${id} not found`);
  //   }
  //   return post;
  // }
  // POST /posts
  // @Post()
  // async create(
  //   @Body() createPostDto: CreatePostDto,
  //   @CurrentUser() user: any,
  // ): Promise<Posts> {
  //   return this.postsService.create(createPostDto, user.sub);
  // }
  // @Post()
  // async create(
  //   @Body() createPostDto: CreatePostDto,
  //   @CurrentUser() user: any,
  // ): Promise<Posts> {
  //   return this.postsService.create(createPostDto, user.sub);
  // }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updatePostDto: UpdatePostDto,
  //   @CurrentUser() user: any,
  // ): Promise<Posts> {
  //   console.log('post updated');
  //   return this.postsService.update(Number(id), updatePostDto, user.sub);
  // }
}
