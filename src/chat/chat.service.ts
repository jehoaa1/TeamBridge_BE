import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class ChatService {
  private connectedClients: Map<string, Socket> = new Map();

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
} 