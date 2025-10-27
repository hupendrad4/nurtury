import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('categoryId') categoryId?: string,
    @Query('sortBy') sortBy?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isMedicinal') isMedicinal?: string
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const orderBy: any = {};
    if (sortBy === 'price-asc') orderBy.basePrice = 'asc';
    else if (sortBy === 'price-desc') orderBy.basePrice = 'desc';
    else if (sortBy === 'name') orderBy.name = 'asc';
    else if (sortBy === 'rating') orderBy.rating = 'desc';
    else if (sortBy === 'newest') orderBy.createdAt = 'desc';
    else orderBy.createdAt = 'desc';

    const where: any = { isActive: true, deletedAt: null };
    if (categoryId) where.categoryId = categoryId;
    if (isMedicinal === 'true') where.isMedicinal = true;

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    return this.productsService.findAll({ skip, take, where, orderBy });
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sortBy') sortBy?: string
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const orderBy: any = {};
    if (sortBy === 'price-asc') orderBy.basePrice = 'asc';
    else if (sortBy === 'price-desc') orderBy.basePrice = 'desc';
    else if (sortBy === 'name') orderBy.name = 'asc';
    else if (sortBy === 'rating') orderBy.rating = 'desc';
    else orderBy.createdAt = 'desc';

    return this.productsService.search(query, { skip, take, orderBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
