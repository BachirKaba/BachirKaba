import { Injectable } from '@nestjs/common';
import { DriverStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private prisma: PrismaService) {}

  async setOnline(userId: string, lat: number, lng: number) {
    return this.prisma.driverProfile.update({ where: { userId }, data: { status: DriverStatus.ONLINE, currentLat: lat, currentLng: lng } });
  }

  async setOffline(userId: string) {
    return this.prisma.driverProfile.update({ where: { userId }, data: { status: DriverStatus.OFFLINE } });
  }
}
