import { Injectable } from '@nestjs/common';

type Loc = { lat: number; lng: number };

@Injectable()
export class MatchingService {
  haversineKm(a: Loc, b: Loc) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const aa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  }

  estimateFare(distanceKm: number, at = new Date()) {
    const base = 5000;
    const perKm = 2000;
    const minFare = 8000;
    const hour = at.getHours();
    const nightMultiplier = hour >= 21 || hour < 6 ? 1.2 : 1;
    return Math.ceil(Math.max(minFare, (base + distanceKm * perKm) * nightMultiplier));
  }
}
