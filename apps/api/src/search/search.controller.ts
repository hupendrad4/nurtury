import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchService } from './search.service';

type SearchQueryParams = {
  q?: string;
  page?: string;
  limit?: string;
  sort?: string;
  [key: string]: string | string[] | undefined;
};

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  @ApiOperation({ summary: 'Search products with filters' })
  @ApiResponse({ status: 200, description: 'Returns filtered products' })
  @UseGuards(JwtAuthGuard)
  async searchProducts(
    @Query() queryParams: SearchQueryParams,
  ) {
    const { q: query = '', page = '1', limit = '12', sort = 'relevance', ...filters } = queryParams;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    // Clean up filters - remove pagination and sorting params
    const cleanFilters = { ...filters };
    delete cleanFilters.page;
    delete cleanFilters.limit;
    delete cleanFilters.sort;
    delete cleanFilters.q;

    return this.searchService.searchProducts({
      query,
      page: pageNum,
      limit: limitNum,
      sort,
      filters: cleanFilters,
    });
  }
}
