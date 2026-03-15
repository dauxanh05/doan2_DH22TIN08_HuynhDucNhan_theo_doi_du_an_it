import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.type !== 'access') {
        this.logger.warn(`Client ${client.id} used non-access token`);
        client.disconnect();
        return;
      }

      client.data.userId = payload.sub;
      await client.join(`user:${payload.sub}`);

      this.logger.log(`Client ${client.id} connected (user: ${payload.sub})`);
    } catch {
      this.logger.warn(`Client ${client.id} auth failed`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join_workspace')
  async handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    await client.join(`workspace:${data.workspaceId}`);
    this.logger.log(
      `Client ${client.id} joined workspace:${data.workspaceId}`,
    );
  }

  @SubscribeMessage('leave_workspace')
  async handleLeaveWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    await client.leave(`workspace:${data.workspaceId}`);
    this.logger.log(`Client ${client.id} left workspace:${data.workspaceId}`);
  }

  // ============================================================
  // Emit helpers — exported cho modules khac dung
  // ============================================================

  emitToWorkspace(workspaceId: string, event: string, data: unknown) {
    this.server.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
