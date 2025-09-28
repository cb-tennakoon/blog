import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokenBlacklistService {
  constructor(private prisma: PrismaService) {}

  async isBlacklisted(token: string): Promise<boolean> {
    const entry = await this.prisma.tokenBlacklist.findUnique({ where: { token } });
    return !!entry;
  }

  async addToBlacklist(token: string): Promise<void> {
    await this.prisma.tokenBlacklist.create({ data: { token } });
  }
}