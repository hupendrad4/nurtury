import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';
import { PrismaService } from '../prisma/prisma.service';

type SearchOptions = {
  query?: string;
  page?: number;
  limit?: number;
  sort?: string;
  filters?: Record<string, any>;
};

type SearchResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

@Injectable()
export class SearchService {
  private client: MeiliSearch;
  private readonly defaultLimit = 12;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.client = new MeiliSearch({
      host: config.get('MEILISEARCH_HOST', 'http://localhost:7700'),
      apiKey: config.get('MEILISEARCH_API_KEY', 'masterKey'),
    });
  }

  async indexProduct(product: any) {
    const index = this.client.index('products');
    await index.addDocuments([product]);
  }

  async searchProducts({
    query = '',
    page = 1,
    limit = this.defaultLimit,
    sort = 'relevance',
    filters = {},
  }: SearchOptions): Promise<SearchResult<any>> {
    // For now, we'll use Prisma for search until MeiliSearch is fully set up
    // This is a fallback implementation
    return this.searchWithPrisma({
      query,
      page,
      limit,
      sort,
      filters,
    });
  }

  private async searchWithPrisma({
    query = '',
    page = 1,
    limit = this.defaultLimit,
    sort = 'relevance',
    filters = {},
  }: SearchOptions): Promise<SearchResult<any>> {
    const skip = (page - 1) * limit;
    
    // Build where clause based on filters
    const where: any = {};
    
    // Text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query.toLowerCase() } },
      ];
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'category') {
        where.categoryId = value;
      } else if (key === 'price') {
        const priceRanges = Array.isArray(value) ? value : [value];
        where.OR = [
          ...(where.OR || []),
          ...priceRanges.map((range: string) => {
            const [min, max] = range.split('-').map(Number);
            if (isNaN(max)) {
              return { price: { gte: min } };
            }
            return { price: { gte: min, lte: max } };
          }),
        ];
      } else if (key === 'type') {
        const types = Array.isArray(value) ? value : [value];
        where.tags = { hasSome: types };
      } else if (key === 'rating') {
        const minRating = Math.min(...value.split(',').map(Number));
        where.rating = { gte: minRating };
      }
    });
    
    // Build orderBy based on sort parameter
    let orderBy: any = {};
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating-desc':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        // Default sort by relevance (best match)
        if (query) {
          // In a real implementation, you would use full-text search relevance here
          orderBy = { name: 'asc' };
        }
        break;
    }
    
    // Get total count
    const total = await this.prisma.product.count({ where });
    
    // Get paginated results
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });
    
    // Transform the data
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price.toString()),
      salePrice: product.salePrice ? parseFloat(product.salePrice.toString()) : null,
      rating: product.rating || 0,
      reviewCount: product.reviews.length,
      images: product.images,
      inStock: product.stock > 0,
      isNew: product.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // New if created in last 30 days
      isOnSale: product.salePrice !== null,
      category: product.category,
    }));
    
    return {
      data: transformedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  
  private buildMeiliSearchFilters(filters: Record<string, any>): string[] {
    const filterConditions: string[] = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'category') {
        filterConditions.push(`categoryId = ${value}`);
      } else if (key === 'price') {
        const priceConditions = (Array.isArray(value) ? value : [value]).map((range: string) => {
          const [min, max] = range.split('-').map(Number);
          if (isNaN(max)) {
            return `price >= ${min}`;
          }
          return `price >= ${min} AND price <= ${max}`;
        });
        filterConditions.push(`(${priceConditions.join(' OR ')})`);
      } else if (key === 'type') {
        const types = Array.isArray(value) ? value : [value];
        filterConditions.push(`(${types.map(t => `tags = ${t}`).join(' OR ')})`);
      } else if (key === 'rating') {
        const minRating = Math.min(...value.split(',').map(Number));
        filterConditions.push(`rating >= ${minRating}`);
      }
    });
    
    return filterConditions;
  }
}
