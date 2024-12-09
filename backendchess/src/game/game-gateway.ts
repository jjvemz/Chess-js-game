/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, { roomId: string; players: { id: string; username?: string }[] }> = new Map();

  @SubscribeMessage('username')
  handleUsername(@ConnectedSocket() client: Socket, @MessageBody() username: string): void {
    console.log(username);
    client.data.username = username;
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() callback: (roomId: string) => void): Promise<void> {
    const roomId = uuidv4();
    await client.join(roomId);

    this.rooms.set(roomId, {
      roomId,
      players: [{ id: client.id, username: client.data?.username }],
    });

    console.log(`Room created: ${roomId}, Host joined`);
    console.log('Rooms state:', this.rooms);

    callback(roomId);
  }
}