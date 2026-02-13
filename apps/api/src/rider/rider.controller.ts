import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TripsService } from '../trips/trips.service';

class CreateTripDto {
  @IsString() pickupAddress!: string;
  @IsString() dropoffAddress!: string;
  @IsNumber() pickupLat!: number;
  @IsNumber() pickupLng!: number;
  @IsNumber() dropoffLat!: number;
  @IsNumber() dropoffLng!: number;
  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod = PaymentMethod.CASH;
}

class CancelTripDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('rider')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rider/trips')
export class RiderController {
  constructor(private trips: TripsService) {}

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateTripDto) {
    return this.trips.createTrip(user.userId, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.trips.getRiderTrip(id, user.userId);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() dto: CancelTripDto) {
    return this.trips.cancelByRider(id, user.userId, dto.reason);
  }
}
