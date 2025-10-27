import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            variants: { where: { isActive: true }, take: 1 },
          },
        },
      },
    });
  }

  async add(userId: string, productId: string) {
    return this.prisma.wishlistItem.create({
      data: { userId, productId },
    });
  }

  async remove(userId: string, productId: string) {
    return this.prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
  }
}
