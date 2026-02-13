import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { TripsModule } from '../trips/trips.module';

@Module({ imports: [TripsModule], controllers: [RiderController] })
export class RiderModule {}
