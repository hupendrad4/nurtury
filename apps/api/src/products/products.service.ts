import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    const { skip = 0, take = 20, where, orderBy } = params;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where: { ...where, deletedAt: null },
        orderBy,
        include: {
          category: true,
          variants: {
            where: { isActive: true },
          },
        },
      }),
      this.prisma.product.count({ where: { ...where, deletedAt: null } }),
    ]);

    return {
      data: products,
      total,
      page: Math.floor(skip / take) + 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async search(query: string, filters?: any) {
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.basePrice = {};
      if (filters.minPrice) where.basePrice.gte = filters.minPrice;
      if (filters.maxPrice) where.basePrice.lte = filters.maxPrice;
    }

    if (filters?.isMedicinal !== undefined) {
      where.isMedicinal = filters.isMedicinal;
    }

    if (filters?.sunlightRequirement) {
      where.sunlightRequirement = filters.sunlightRequirement;
    }

    if (filters?.waterRequirement) {
      where.waterRequirement = filters.waterRequirement;
    }

    return this.findAll({
      skip: filters?.skip,
      take: filters?.take,
      where,
      orderBy: filters?.orderBy || { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: string, limit = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, tags: true },
    });

    if (!product) {
      return [];
    }

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        deletedAt: null,
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { tags: { hasSome: product.tags } },
        ],
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          take: 1,
        },
      },
      take: limit,
    });
  }
}
