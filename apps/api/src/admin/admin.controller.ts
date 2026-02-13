import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('users') users() { return this.admin.users(); }
  @Get('drivers') drivers() { return this.admin.drivers(); }
  @Post('drivers/:id/approve') approve(@Param('id') id: string) { return this.admin.approveDriver(id); }
  @Get('trips') trips() { return this.admin.trips(); }
  @Get('trips/:id') trip(@Param('id') id: string) { return this.admin.trip(id); }
}
