import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, include: { driverProfile: true } });
  }

  updateMe(userId: string, data: { name?: string; city?: string }) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }
}
