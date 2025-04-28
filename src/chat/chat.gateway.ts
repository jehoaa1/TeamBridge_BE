import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    this.chatService.handleDisconnect(client);
  }

  @SubscribeMessage("join")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const { roomId } = data;
    const clients = await this.chatService.handleJoin(client, roomId);

    // 방에 참여
    await client.join(roomId);

    // 입장한 클라이언트에게는 'join' 응답 보내기 (⭐ 이게 필요함)
    client.emit("join", {
      roomId,
      clientId: client.id,
      clients,
    });

    // 방에 있는 모든 클라이언트에게 새로운 참여자 알림
    this.server.to(roomId).emit("userJoined", {
      roomId,
      clientId: client.id,
      clients,
    });

    // 방에 두 명이 있으면 ready 이벤트 발생
    if (clients.length >= 2) {
      this.server.to(roomId).emit("ready", {
        roomId,
        clients,
      });
    }

    return { event: "join", roomId, clients: clients };
  }

  @SubscribeMessage("message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      senderId: string;
      message: string;
      timestamp: number;
    }
  ) {
    const { roomId, senderId, message, timestamp } = data;

    // 해당 방(roomId)으로 메시지 브로드캐스팅
    this.server.to(roomId).emit("message", {
      senderId,
      message,
      timestamp,
    });
  }

  @SubscribeMessage("offer")
  async handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; offer: RTCSessionDescriptionInit }
  ) {
    const { roomId, offer } = data;
    this.server.to(roomId).emit("offer", {
      offer,
      from: client.id,
    });
  }

  @SubscribeMessage("answer")
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; answer: RTCSessionDescriptionInit }
  ) {
    const { roomId, answer } = data;
    this.server.to(roomId).emit("answer", {
      answer,
      from: client.id,
    });
  }

  @SubscribeMessage("ice-candidate")
  async handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; candidate: RTCIceCandidateInit }
  ) {
    const { roomId, candidate } = data;
    this.server.to(roomId).emit("ice-candidate", {
      candidate,
      from: client.id,
    });
  }
}
