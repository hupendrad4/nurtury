import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Req() req, @Body() body: { variantId: string; quantity: number }) {
    return this.cartService.addItem(req.user.id, body.variantId, body.quantity);
  }

  @Put('items/:id')
  updateItem(@Req() req, @Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItem(req.user.id, id, body.quantity);
  }

  @Delete('items/:id')
  removeItem(@Req() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Post('coupon')
  applyCoupon(@Req() req, @Body() body: { code: string }) {
    return this.cartService.applyCoupon(req.user.id, body.code);
  }

  @Delete('coupon')
  removeCoupon(@Req() req) {
    return this.cartService.removeCoupon(req.user.id);
  }
}
