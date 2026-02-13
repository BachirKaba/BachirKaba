import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async requestOtp(phone: string, role: Role) {
    const code = '123456';
    await this.prisma.oTP.create({
      data: {
        phone,
        role,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      }
    });
    return { success: true, mockOtp: code };
  }

  async verifyOtp(phone: string, code: string, role: Role, name?: string) {
    const latest = await this.prisma.oTP.findFirst({ where: { phone, role }, orderBy: { createdAt: 'desc' } });
    if (!latest || latest.code !== code || latest.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.prisma.user.upsert({
      where: { phone },
      update: { role, ...(name ? { name } : {}) },
      create: { phone, role, name: name ?? `${role} User` }
    });

    const payload = { sub: user.id, role: user.role, phone: user.phone };
    return {
      accessToken: await this.jwt.signAsync(payload, { expiresIn: '1h' }),
      refreshToken: await this.jwt.signAsync(payload, { expiresIn: '7d' }),
      user
    };
  }
}
