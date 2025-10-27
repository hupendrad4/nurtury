import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':orderNumber')
  findByOrderNumber(@Req() req, @Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(req.user.id, orderNumber);
  }

  @Get('id/:id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.id, id);
  }

  @Post()
  create(@Req() req, @Body() data: any) {
    return this.ordersService.create(req.user.id, data);
  }

  @Post(':id/verify-payment')
  verifyPayment(@Req() req, @Param('id') id: string, @Body() data: any) {
    return this.ordersService.verifyPayment(req.user.id, id, data);
  }

  @Put(':id/cancel')
  cancelOrder(@Req() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.id, id);
  }
}
