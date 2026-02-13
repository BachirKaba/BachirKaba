# Moto Taxi Guinea MVP (Uber-like)

Monorepo with backend API, mobile app, admin dashboard, and shared domain types.

## Monorepo structure

- `apps/api` NestJS API + Prisma + Socket.IO
- `apps/mobile` Expo React Native app
- `apps/admin` Vite React admin dashboard
- `packages/shared` shared enums, schemas, types
- `docker` local infrastructure config

## Quick start (local)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start infra:
   ```bash
   docker compose -f docker/docker-compose.yml up -d db redis
   ```
3. Configure env:
   ```bash
   cp .env.example .env
   ```
4. Run Prisma:
   ```bash
   npm run prisma:generate -w @moto/api
   npm run prisma:migrate -w @moto/api -- --name init
   npm run seed -w @moto/api
   ```
5. Start apps:
   ```bash
   npm run dev:api
   npm run dev:mobile
   npm run dev:admin
   ```

## API docs
- Swagger: `http://localhost:3000/api/docs`

### Key REST endpoints
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `GET /api/me`
- `PUT /api/me`
- `POST /api/rider/trips`
- `GET /api/rider/trips/:id`
- `POST /api/rider/trips/:id/cancel`
- `POST /api/driver/online`
- `POST /api/driver/offline`
- `POST /api/driver/trips/:id/accept`
- `POST /api/driver/trips/:id/reject`
- `POST /api/driver/trips/:id/status`
- `GET /api/driver/trips/active`

### WebSocket events
- `driver:location:update`
- `trip:created`
- `trip:offered_to_driver`
- `trip:accepted`
- `trip:status_changed`
- `trip:canceled`

## Matching logic
- Radius starts at 3km.
- Finds online + approved drivers nearest to pickup.
- Offers top 3 drivers.
- If no available driver, marks `NO_DRIVER_FOUND`.

## Pricing
- Base fare = 5,000 GNF
- Per km = 2,000 GNF
- Minimum fare = 8,000 GNF
- Night multiplier = 1.2 (21:00–06:00)

## Payments
- `CASH` enabled now.
- `ORANGE_MONEY` present as future-ready enum and schema field.

## What to do next
1. Add Redis-backed distributed matching queues + expiration timers (20s per offer, 60s search timeout).
2. Integrate actual maps (Google Maps/Mapbox) distance matrix and route lines.
3. Add role-based authorization guards and admin authentication.
4. Implement push notifications with Expo token registration and delivery service.
5. Expand mobile/admin from minimal shell to full navigable flows + map screens.
