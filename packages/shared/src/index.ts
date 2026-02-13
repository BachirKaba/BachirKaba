import { z } from 'zod';

export enum Role {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum DriverStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  BUSY = 'BUSY'
}

export enum DriverApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TripStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_DRIVER_FOUND = 'NO_DRIVER_FOUND'
}

export enum PaymentMethod {
  CASH = 'CASH',
  ORANGE_MONEY = 'ORANGE_MONEY'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID'
}

export type Coordinates = { lat: number; lng: number };

export const requestOtpSchema = z.object({
  phone: z.string().min(8),
  role: z.nativeEnum(Role)
});

export const verifyOtpSchema = z.object({
  phone: z.string().min(8),
  otp: z.string().length(6),
  name: z.string().optional(),
  role: z.nativeEnum(Role)
});

export const createTripSchema = z.object({
  pickupAddress: z.string(),
  dropoffAddress: z.string(),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH)
});

export const updateLocationSchema = z.object({
  lat: z.number(),
  lng: z.number()
});
