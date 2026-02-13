import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { TripsModule } from '../trips/trips.module';

@Module({ imports: [TripsModule], controllers: [DriverController], providers: [DriverService] })
export class DriverModule {}
