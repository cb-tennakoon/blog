import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Posts } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto, PostResponseDto } from './dto/create-post.dto';
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
  // async findById(id: number): Promise<Posts | null> {
  //   return this.prisma.posts.findUnique({
  //     where: { postId: id },
  //     include: { author: true },
  //   });
  // }
  // async create(createPostDto: CreatePostDto, userId: number): Promise<Posts> {
  //   // Check if slug is unique
  //   const existingPost = await this.prisma.posts.findUnique({
  //     where: { slug: createPostDto.slug },
  //   });
  //   if (existingPost) {
  //     throw new BadRequestException(
  //       `Post with slug "${createPostDto.slug}" already exists`,
  //     );
  //   }

  //   // Check if author exists
  //   const author = await this.prisma.author.findUnique({
  //     where: { authorId: userId },
  //   });
  //   if (!author) {
  //     throw new BadRequestException(`Author with ID ${userId} not found`);
  //   }

  //   return this.prisma.posts.create({
  //     data: {
  //       authorId: userId,
  //       title: createPostDto.title,
  //       slug: createPostDto.slug,
  //       content: createPostDto.content,
  //       status: createPostDto.status || 'draft',
  //       publishedAt: createPostDto.publishedAt,
  //     },
  //     include: { author: true },
  //   });
  // }
  // async update(
  //   id: number,
  //   updatePostDto: UpdatePostDto,
  //   userId: number,
  // ): Promise<Posts> {
  //   const post = await this.prisma.posts.findUnique({ where: { postId: id } });
  //   if (!post) {
  //     throw new NotFoundException(`Post with ID ${id} not found`);
  //   }
  //   if (post.authorId !== userId) {
  //     throw new ForbiddenException(
  //       'You are not authorized to update this post',
  //     );
  //   }
  //   return this.prisma.posts.update({
  //     where: { postId: id },
  //     data: {
  //       title: updatePostDto.title,
  //       slug: updatePostDto.slug,
  //       content: updatePostDto.content,
  //       status: updatePostDto.status,
  //       publishedAt: updatePostDto.publishedAt,
  //       authorId: userId,
  //     },
  //   });
  // }
  async create(
    authorId: number,
    createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    if (!authorId || isNaN(authorId)) {
      console.error(`Invalid authorId in create: ${authorId}`);
      throw new NotFoundException('Invalid author ID');
    }
    console.log(`Creating post with data:`, createPostDto);
    try {
      const post = await this.prisma.posts.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content || null,
          slug: createPostDto.slug || this.generateSlug(createPostDto.title),
          status: createPostDto.status || 'draft',
          authorId,
          publishedAt:
            createPostDto.publishedAt ||
            (createPostDto.status === 'published' ? new Date() : null),
        },
        select: {
          postId: true,
          title: true,
          content: true,
          slug: true,
          status: true,
          createdAt: true,
          authorId: true,
          publishedAt: true, // Added to select
        },
      });
      return {
        ...post,
        createdAt: post.createdAt.toISOString(),
        publishedAt: post.publishedAt
          ? post.publishedAt.toISOString()
          : undefined,
      };
    } catch (error) {
      console.error(`Error creating post:`, error);
      if (error.code === 'P2002') {
        throw new NotFoundException(`Slug '${createPostDto.slug}' already exists`);
      }
      throw new NotFoundException('Failed to create post');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
  async findOne(id: number, authorId: number): Promise<PostResponseDto> {
    if (!id || isNaN(id) || !authorId || isNaN(authorId)) {
      console.error(`Invalid id: ${id} or authorId: ${authorId}`);
      throw new NotFoundException('Invalid post or author ID');
    }
    console.log(`Fetching post id: ${id} for authorId: ${authorId}`);
    try {
      const post = await this.prisma.posts.findFirst({
        where: { postId: id, authorId },
        select: {
          postId: true,
          title: true,
          content: true,
          slug: true,
          status: true,
          createdAt: true,
          authorId: true,
          publishedAt: true,
        },
      });
      if (!post) {
        throw new NotFoundException(
          `Post with id ${id} not found or not owned by author ${authorId}`,
        );
      }
      return {
        ...post,
        createdAt: post.createdAt.toISOString(),
        publishedAt: post.publishedAt
          ? post.publishedAt.toISOString()
          : undefined,
      };
    } catch (error) {
      console.error(`Error fetching post id: ${id}:`, error);
      throw new NotFoundException(`Failed to fetch post with id ${id}`);
    }
  }
  async update(
    id: number,
    authorId: number,
    updatePostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    if (!id || isNaN(id) || !authorId || isNaN(authorId)) {
      console.error(`Invalid id: ${id} or authorId: ${authorId}`);
      throw new NotFoundException('Invalid post or author ID');
    }
    console.log(`Updating post id: ${id} with data:`, updatePostDto);
    try {
      const post = await this.prisma.posts.findFirst({
        where: { postId: id, authorId },
      });
      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found or not owned by author ${authorId}`);
      }
      const updatedPost = await this.prisma.posts.update({
        where: { postId: id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content || null,
          slug: updatePostDto.slug,
          status: updatePostDto.status || 'draft',
          publishedAt:
            updatePostDto.publishedAt ||
            (updatePostDto.status === 'published' ? new Date() : null),
        },
        select: {
          postId: true,
          title: true,
          content: true,
          slug: true,
          status: true,
          createdAt: true,
          authorId: true,
          publishedAt: true,
        },
      });
      return {
        ...updatedPost,
        createdAt: updatedPost.createdAt.toISOString(),
        publishedAt: updatedPost.publishedAt
          ? updatedPost.publishedAt.toISOString()
          : undefined,
      };
    } catch (error) {
      console.error(`Error updating post id: ${id}:`, error);
      if (error.code === 'P2002') {
        throw new NotFoundException(
          `Slug '${updatePostDto.slug}' already exists`,
        );
      }
      throw new NotFoundException(`Failed to update post with id ${id}`);
    }
  }
  async delete(id: number, authorId: number): Promise<void> {
    if (!id || isNaN(id) || !authorId || isNaN(authorId)) {
      console.error(`Invalid id: ${id} or authorId: ${authorId}`);
      throw new NotFoundException('Invalid post or author ID');
    }
    console.log(`Deleting post id: ${id} for authorId: ${authorId}`);
    try {
      const post = await this.prisma.posts.findFirst({
        where: { postId: id, authorId },
      });
      if (!post) {
        throw new NotFoundException(
          `Post with id ${id} not found or not owned by author ${authorId}`,
        );
      }
      await this.prisma.posts.delete({
        where: { postId: id },
      });
    } catch (error) {
      console.error(`Error deleting post id: ${id}:`, error);
      throw new NotFoundException(`Failed to delete post with id ${id}`);
    }
  }
}
