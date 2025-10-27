import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { isActive: true, deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: {
        children: {
          where: { isActive: true, deletedAt: null },
        },
        products: {
          where: { isActive: true, deletedAt: null },
          take: 10,
        },
      },
    });
  }
}
