import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Posts } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, sub?: any): Promise<Posts[]> {
    return this.prisma.posts.findMany({
      where: status ? { status } : undefined,
      include: { author: true }, // Include author relation
    });
  }
  async findById(id: number): Promise<Posts | null> {
    return this.prisma.posts.findUnique({
      where: { postId: id },
      include: { author: true },
    });
  }
  async create(createPostDto: CreatePostDto, userId: number): Promise<Posts> {
    // Check if slug is unique
    const existingPost = await this.prisma.posts.findUnique({
      where: { slug: createPostDto.slug },
    });
    if (existingPost) {
      throw new BadRequestException(
        `Post with slug "${createPostDto.slug}" already exists`,
      );
    }

    // Check if author exists
    const author = await this.prisma.author.findUnique({
      where: { authorId: userId },
    });
    if (!author) {
      throw new BadRequestException(`Author with ID ${userId} not found`);
    }

    return this.prisma.posts.create({
      data: {
        authorId: userId,
        title: createPostDto.title,
        slug: createPostDto.slug,
        content: createPostDto.content,
        status: createPostDto.status || 'draft',
        publishedAt: createPostDto.publishedAt,
      },
      include: { author: true },
    });
  }
  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Posts> {
    const post = await this.prisma.posts.findUnique({ where: { postId: id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }
    return this.prisma.posts.update({
      where: { postId: id },
      data: {
        title: updatePostDto.title,
        slug: updatePostDto.slug,
        content: updatePostDto.content,
        status: updatePostDto.status,
        publishedAt: updatePostDto.publishedAt,
        authorId: userId,
      },
    });
  }
  async findAllPostOfAuthor(
    status: string | undefined,
    authorId: number,
  ): Promise<Posts[]> {
    return this.prisma.posts.findMany({
      where: {
        authorId,
        status: status ? { equals: status } : undefined,
      },
    });
  }
}
