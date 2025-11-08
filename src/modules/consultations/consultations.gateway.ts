import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConsultationsService } from './consultations.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/consultations' })
export class ConsultationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private vetConnections = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private consultationsService: ConsultationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      
      console.log(`Client connected: ${client.id}, userId: ${payload.sub}, role: ${payload.role}`);
    } catch (error) {
      console.error('Connection auth error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.role === 'vet') {
      this.vetConnections.delete(client.data.userId);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('consultation:register')
  async handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { role: string; vetId: string },
  ) {
    if (data.role === 'veterinarian' && client.data.role === 'vet') {
      this.vetConnections.set(client.data.userId, client.id);
      return { success: true, message: 'Registered as available vet' };
    }
    return { success: false, error: 'Invalid role' };
  }

  @SubscribeMessage('consultation:accept')
  async handleAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { consultationId: string },
  ) {
    try {
      if (client.data.role !== 'vet') {
        return { success: false, error: 'Only vets can accept consultations' };
      }

      const consultation = await this.consultationsService.acceptConsultation(
        data.consultationId,
        client.data.userId,
      );

      this.server.emit('consultation:claimed', {
        consultationId: data.consultationId,
        vetId: client.data.userId,
        vetName: consultation.veterinarianName,
      });

      return { success: true, consultation };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('consultation:release')
  async handleRelease(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { consultationId: string },
  ) {
    try {
      if (client.data.role !== 'vet') {
        return { success: false, error: 'Only vets can release consultations' };
      }

      await this.consultationsService.releaseConsultation(data.consultationId, client.data.userId);

      this.server.emit('consultation:released', {
        consultationId: data.consultationId,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  notifyNewConsultation(consultation: any) {
    this.server.emit('consultation:incoming', consultation);
  }

  notifyConsultationCompleted(consultationId: string) {
    this.server.emit('consultation:completed', { consultationId });
  }

  notifyConsultationUpdated(consultationId: string, updates: any) {
    this.server.emit('consultation:updated', { consultationId, ...updates });
  }
}
