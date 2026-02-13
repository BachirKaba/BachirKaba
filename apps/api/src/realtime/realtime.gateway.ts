import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  emitTripCreated(trip: unknown) {
    this.server.emit('trip:created', trip);
  }

  emitTripOffer(driverUserId: string, trip: unknown) {
    this.server.to(`driver:${driverUserId}`).emit('trip:offered_to_driver', trip);
  }

  emitTripAccepted(trip: unknown) {
    this.server.emit('trip:accepted', trip);
  }

  emitStatus(trip: unknown) {
    this.server.emit('trip:status_changed', trip);
  }

  emitTripCanceled(trip: unknown) {
    this.server.emit('trip:canceled', trip);
  }
}
