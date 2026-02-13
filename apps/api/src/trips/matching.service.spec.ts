import { MatchingService } from './matching.service';

describe('MatchingService', () => {
  const service = new MatchingService();

  it('calculates haversine distance', () => {
    const km = service.haversineKm({ lat: 9.6412, lng: -13.5784 }, { lat: 9.65, lng: -13.57 });
    expect(km).toBeGreaterThan(1);
    expect(km).toBeLessThan(2);
  });

  it('applies minimum fare', () => {
    expect(service.estimateFare(0.2, new Date('2024-01-01T10:00:00Z'))).toBeGreaterThanOrEqual(8000);
  });
});
