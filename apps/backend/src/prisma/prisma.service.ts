import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Changed from '../../generated/prisma'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super();
    // Optional: Log to verify DATABASE_URL is loaded (remove in production)
    console.log(
      'DATABASE_URL loaded:',
      this.configService.get('DATABASE_URL') ? '✓' : '✗',
    );
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
