import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async findActive() {
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          { validFrom: null, validUntil: null },
          {
            validFrom: { lte: new Date() },
            validUntil: { gte: new Date() },
          },
        ],
      },
      orderBy: { order: 'asc' },
    });
  }
}
