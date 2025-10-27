import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddressesService } from './addresses.service';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Get()
  findAll(@Req() req) {
    return this.addressesService.findAll(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() data: any) {
    return this.addressesService.create(req.user.id, data);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() data: any) {
    return this.addressesService.update(req.user.id, id, data);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.addressesService.remove(req.user.id, id);
  }
}
