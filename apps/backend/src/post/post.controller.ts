import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Posts } from '@prisma/client';
import { Public } from 'auth/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
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
  // GET /posts/:id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Posts> {
    const post = await this.postsService.findById(Number(id));
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }
  // POST /posts
  // @Post()
  // async create(
  //   @Body() createPostDto: CreatePostDto,
  //   @CurrentUser() user: any,
  // ): Promise<Posts> {
  //   return this.postsService.create(createPostDto, user.sub);
  // }
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<Posts> {
    return this.postsService.create(createPostDto, user.sub);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<Posts> {
    console.log('post updated');
    return this.postsService.update(Number(id), updatePostDto, user.sub);
  }
}
