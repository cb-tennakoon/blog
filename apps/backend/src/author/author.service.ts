import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  AuthorResponseDto,
  AuthorResponseDtoWithID,
  CreateAuthorDto,
} from './dto/author.dto';
@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Author[]> {
    return this.prisma.author.findMany();
  }
  async findOne(authorId: number): Promise<AuthorResponseDtoWithID | null> {
    const author = await this.prisma.author.findUnique({
      where: { authorId },
      select: {
        authorId: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        createdAt: true,
      },
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }
    return author;
  }
  async create(CreateAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    const { password, roleName, ...rest } = CreateAuthorDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    let roleId: string | null = null;
    if (roleName) {
      console.log(`Looking up role with name: ${roleName}`);
      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
        select: { id: true },
      });
      if (!role) {
        throw new NotFoundException(`Role with name '${roleName}' not found`);
      }
      roleId = role.id;
    }
    try{
      const author = await this.prisma.author.create({
        data: {
          ...rest,
          passwordHash: hashedPassword,
          roleId,
        },
        select: {
          authorId: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          roleId: true,
          createdAt: true,
        },
      });
      return author;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }
  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<(AuthorResponseDto & { passwordHash: string }) | null> {
    console.log(
      `Searching for author with emailOrUsername: ${emailOrUsername}`,
    );
    const author = await this.prisma.author.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
      select: {
        authorId: true,
        username: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        roleId: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (author) {
      console.log(
        `Found author with ${author.email === emailOrUsername ? 'email' : 'username'}: ${emailOrUsername}`,
      );
    } else {
      console.log(`No author found for emailOrUsername: ${emailOrUsername}`);
    }
    return author;
  }
}
