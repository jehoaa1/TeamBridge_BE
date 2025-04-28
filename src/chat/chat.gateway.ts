import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    const { roomId } = data;
    client.join(roomId);
  }

  @SubscribeMessage("offer")
  async handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; offer: any }
  ) {
    client
      .to(data.roomId)
      .emit("offer", { offer: data.offer, senderId: client.id });
  }

  @SubscribeMessage("answer")
  async handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; answer: any }
  ) {
    client
      .to(data.roomId)
      .emit("answer", { answer: data.answer, senderId: client.id });
  }

  @SubscribeMessage("ice-candidate")
  async handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; candidate: any }
  ) {
    client.to(data.roomId).emit("ice-candidate", {
      candidate: data.candidate,
      senderId: client.id,
    });
  }
}
