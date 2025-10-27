import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  findAll(@Req() req) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add to wishlist' })
  add(@Req() req, @Body() body: { productId: string }) {
    return this.wishlistService.add(req.user.id, body.productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove from wishlist' })
  remove(@Req() req, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, productId);
  }
}
