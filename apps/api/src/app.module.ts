import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RiderModule } from './rider/rider.module';
import { DriverModule } from './driver/driver.module';
import { TripsModule } from './trips/trips.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RiderModule,
    DriverModule,
    TripsModule,
    RealtimeModule,
    AdminModule
  ]
})
export class AppModule {}
