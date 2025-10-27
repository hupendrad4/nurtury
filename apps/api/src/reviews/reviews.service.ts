import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, productId: string, data: any) {
    const review = await this.prisma.review.create({
      data: { ...data, userId, productId },
    });

    await this.updateProductRating(productId);
    return review;
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isApproved: true },
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating || 0,
        reviewCount: reviews.length,
      },
    });
  }
}
