import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private connectedClients: Map<string, Socket> = new Map();
  private rooms: Map<string, Set<string>> = new Map();

  addClient(userId: string, client: Socket) {
    this.connectedClients.set(userId, client);
  }

  removeClient(userId: string) {
    this.connectedClients.delete(userId);
  }

  findClient(userId: string): Socket | undefined {
    return this.connectedClients.get(userId);
  }

  getConnectedClients(): Map<string, Socket> {
    return this.connectedClients;
  }

  async handleJoin(client: Socket, roomId: string): Promise<string[]> {
    // 방이 없으면 새로 생성
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    // 클라이언트를 방에 추가
    const room = this.rooms.get(roomId);
    room.add(client.id);

    this.logger.debug(`Client ${client.id} joined room ${roomId}`);
    this.logger.debug(`Room ${roomId} has ${room.size} clients`);

    // 방의 모든 클라이언트 ID 반환
    return Array.from(room);
  }

  handleDisconnect(client: Socket) {
    // 클라이언트가 속한 방을 찾아서 제거
    for (const [roomId, clients] of this.rooms.entries()) {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        this.logger.debug(`Client ${client.id} removed from room ${roomId}`);

        // 방이 비어있으면 방 제거
        if (clients.size === 0) {
          this.rooms.delete(roomId);
          this.logger.debug(`Room ${roomId} deleted`);
        }
      }
    }
  }

  getRoomClients(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room) : [];
  }
}
