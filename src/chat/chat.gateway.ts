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

  // @SubscribeMessage("join")
  // async handleJoin(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() data: { roomId: string }
  // ) {
  //   const { roomId } = data;
  //   client.join(roomId);
  // }

  @SubscribeMessage("join")
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ) {
    console.log("join-data.roomId::", data.roomId);
    client.join(data.roomId);
    const clients = Array.from(
      this.server.sockets.adapter.rooms.get(data.roomId) || []
    );
    client.emit("joined", { clients }); // 참여 중인 클라이언트 목록 전송
    client.to(data.roomId).emit("userJoined", { newClientId: client.id });
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
