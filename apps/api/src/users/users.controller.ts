import { Controller, Get, Put, Post, Delete, Body, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  updateProfile(@Req() req, @Body() data: any) {
    return this.usersService.update(req.user.id, data);
  }

  @Get('me/addresses')
  getAddresses(@Req() req) {
    return this.usersService.getAddresses(req.user.id);
  }

  @Post('me/addresses')
  createAddress(@Req() req, @Body() data: any) {
    return this.usersService.createAddress(req.user.id, data);
  }

  @Put('me/addresses/:id')
  updateAddress(@Req() req, @Param('id') id: string, @Body() data: any) {
    return this.usersService.updateAddress(req.user.id, id, data);
  }

  @Delete('me/addresses/:id')
  deleteAddress(@Req() req, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.id, id);
  }
}
