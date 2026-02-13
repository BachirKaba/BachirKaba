import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { TripStatus } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TripsService } from '../trips/trips.service';
import { DriverService } from './driver.service';

class OnlineDto { @IsNumber() lat!: number; @IsNumber() lng!: number; }
class StatusDto { @IsEnum(TripStatus) status!: TripStatus; }

@ApiTags('driver')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriverController {
  constructor(private driverService: DriverService, private trips: TripsService) {}

  @Post('online')
  online(@CurrentUser() user: { userId: string }, @Body() dto: OnlineDto) {
    return this.driverService.setOnline(user.userId, dto.lat, dto.lng);
  }

  @Post('offline')
  offline(@CurrentUser() user: { userId: string }) {
    return this.driverService.setOffline(user.userId);
  }

  @Post('trips/:id/accept')
  accept(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.trips.acceptTrip(id, user.userId);
  }

  @Post('trips/:id/reject')
  reject(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.trips.rejectTrip(id, user.userId);
  }

  @Post('trips/:id/status')
  status(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: StatusDto) {
    return this.trips.updateStatus(id, dto.status, user.userId);
  }

  @Get('trips/active')
  active(@CurrentUser() user: { userId: string }) {
    return this.trips.getDriverActiveTrip(user.userId);
  }
}
