import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DriverStatus, TripStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MatchingService } from './matching.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private matching: MatchingService,
    private realtime: RealtimeGateway
  ) {}

  async createTrip(riderId: string, dto: any) {
    const distanceKm = this.matching.haversineKm(
      { lat: dto.pickupLat, lng: dto.pickupLng },
      { lat: dto.dropoffLat, lng: dto.dropoffLng }
    );
    const fareGnf = this.matching.estimateFare(distanceKm);

    const trip = await this.prisma.trip.create({
      data: { riderId, ...dto, distanceKm, fareGnf }
    });

    this.realtime.emitTripCreated(trip);
    await this.offerTripToNearbyDrivers(trip.id);
    return trip;
  }

  getRiderTrip(id: string, riderId: string) {
    return this.prisma.trip.findFirst({ where: { id, riderId }, include: { driverProfile: { include: { user: true } } } });
  }

  async cancelByRider(tripId: string, riderId: string, reason = 'Rider canceled') {
    const trip = await this.prisma.trip.findFirst({ where: { id: tripId, riderId } });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.status === TripStatus.IN_PROGRESS) throw new BadRequestException('Cannot cancel after start');

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.CANCELED, cancellationReason: reason }
    });
    this.realtime.emitTripCanceled(updated);
    return updated;
  }

  async offerTripToNearbyDrivers(tripId: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    const onlineDrivers = await this.prisma.driverProfile.findMany({
      where: { status: DriverStatus.ONLINE, approvalStatus: 'APPROVED' as any, currentLat: { not: null }, currentLng: { not: null } },
      include: { user: true }
    });

    const ranked = onlineDrivers
      .map((d) => ({
        driver: d,
        distance: this.matching.haversineKm({ lat: trip.pickupLat, lng: trip.pickupLng }, { lat: d.currentLat!, lng: d.currentLng! })
      }))
      .filter((x) => x.distance <= 3)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    if (!ranked.length) {
      const noDriver = await this.prisma.trip.update({ where: { id: tripId }, data: { status: TripStatus.NO_DRIVER_FOUND } });
      this.realtime.emitStatus(noDriver);
      return noDriver;
    }

    ranked.forEach(({ driver }) => this.realtime.emitTripOffer(driver.userId, trip));
    return ranked.map((r) => ({ driverId: r.driver.userId, distance: r.distance }));
  }

  async acceptTrip(tripId: string, driverUserId: string) {
    const profile = await this.prisma.driverProfile.findUnique({ where: { userId: driverUserId } });
    if (!profile) throw new NotFoundException('Driver profile not found');

    const updated = await this.prisma.trip.update({
      where: { id: tripId },
      data: { status: TripStatus.ACCEPTED, driverProfileId: profile.id }
    });
    this.realtime.emitTripAccepted(updated);
    return updated;
  }

  async rejectTrip(tripId: string, driverUserId: string) {
    await this.prisma.tripEvent.create({ data: { tripId, note: `Rejected by ${driverUserId}`, status: TripStatus.REQUESTED, actorId: driverUserId } });
    return { success: true };
  }

  async updateStatus(tripId: string, status: TripStatus, actorId: string) {
    const updated = await this.prisma.trip.update({ where: { id: tripId }, data: { status } });
    await this.prisma.tripEvent.create({ data: { tripId, status, actorId } });
    this.realtime.emitStatus(updated);
    return updated;
  }

  getDriverActiveTrip(driverUserId: string) {
    return this.prisma.trip.findFirst({
      where: {
        driverProfile: { userId: driverUserId },
        status: { in: [TripStatus.ACCEPTED, TripStatus.ARRIVING, TripStatus.IN_PROGRESS] }
      }
    });
  }
}
