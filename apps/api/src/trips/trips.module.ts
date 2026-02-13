import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { MatchingService } from './matching.service';

@Module({
  providers: [TripsService, MatchingService],
  exports: [TripsService, MatchingService]
})
export class TripsModule {}
