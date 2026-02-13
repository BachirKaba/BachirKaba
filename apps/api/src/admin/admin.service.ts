import { Injectable } from '@nestjs/common';
import { DriverApprovalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  users() { return this.prisma.user.findMany({ take: 200 }); }
  drivers() { return this.prisma.driverProfile.findMany({ include: { user: true }, take: 200 }); }
  trips() { return this.prisma.trip.findMany({ include: { rider: true, driverProfile: { include: { user: true } } }, take: 200 }); }
  trip(id: string) { return this.prisma.trip.findUnique({ where: { id }, include: { events: true } }); }

  approveDriver(id: string) {
    return this.prisma.driverProfile.update({ where: { id }, data: { approvalStatus: DriverApprovalStatus.APPROVED } });
  }
}
