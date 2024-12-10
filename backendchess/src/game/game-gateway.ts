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
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
    ...args: any[]
  ): Promise<string | void> {
    const roomId = uuidv4();
    await client.join(roomId);
  
    this.rooms.set(roomId, {
      roomId,
      players: [{ id: client.id, username: client.data?.username }],
    });
  
    console.log(`Room created: ${roomId}, Host joined`);
    console.log('Rooms state:', this.rooms);
  
    return roomId;
  }

  @SubscribeMessage('JoinRoom')
  async handleJoinRoom( @ConnectedSocket() client: Socket,
   @MessageBody() data : {roomId: string, callback:  (response: any) => void}) :Promise<void>{
    const { roomId, callback } = data;
    const room = this.rooms.get(roomId);
    let error= false;
    let message = ''; 

    if (!room) {
      error = true;
      message = 'room does not exist';
    } else if (room.players.length <= 0) {
      error = true;
      message = 'room is empty';
    } else if (room.players.length >= 2) {
      error = true;
      message = 'room is full';
    }

    if (error) {
      if (callback) {
        callback({ error, message });
      }
      return;
    }

    await client.join(roomId);

    const roomUpdate = {
      ...room,
      players: [...room.players, { id: client.id, username: client.data?.username }],
    };

    this.rooms.set(roomId, roomUpdate);

    callback(roomUpdate);

    client.to(roomId).emit('opponentJoined', roomUpdate);
   }
}