import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BannersService } from './banners.service';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get active banners' })
  findActive() {
    return this.bannersService.findActive();
  }
}
