import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.user = payload;
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, payload: { to: string; offer: any }) {
    const targetClient = this.chatService.findClient(payload.to);
    if (targetClient) {
      targetClient.emit('offer', {
        from: client.data.user.userId,
        offer: payload.offer,
      });
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, payload: { to: string; answer: any }) {
    const targetClient = this.chatService.findClient(payload.to);
    if (targetClient) {
      targetClient.emit('answer', {
        from: client.data.user.userId,
        answer: payload.answer,
      });
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, payload: { to: string; candidate: any }) {
    const targetClient = this.chatService.findClient(payload.to);
    if (targetClient) {
      targetClient.emit('ice-candidate', {
        from: client.data.user.userId,
        candidate: payload.candidate,
      });
    }
  }
} 