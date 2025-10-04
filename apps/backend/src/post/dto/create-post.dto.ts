import { IsString, IsInt, IsOptional, IsIn, MinLength } from 'class-validator';

export class CreatePostDto {

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsIn(['draft', 'published'])
  @IsOptional()
  status?: string;

  @IsOptional()
  publishedAt?: Date;
}
export class PostResponseDto {
  postId: number;
  authorId: number;
  title: string;
  content: string | null;
  slug: string;
  status: string;
  createdAt: string;
  publishedAt?: string;
}
