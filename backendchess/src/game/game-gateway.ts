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
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ): Promise<any> {
    const { roomId } = data;
    const room = this.rooms.get(roomId);
    let error = false;
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
      return { error, message };
    }

    await client.join(roomId);

    const roomUpdate = {
      ...room,
      players: [...room.players, { id: client.id, username: client.data?.username }],
    };

    this.rooms.set(roomId, roomUpdate);
    
    client.to(roomId).emit('opponentJoined', roomUpdate);
    
    return roomUpdate;
  }

  @SubscribeMessage('move')
  async handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { move: any; room: string }
  ): Promise<void> {
    const { move, room } = data;
    console.log(`Move received in room ${room}:`, move);
    
    // Broadcast the move to the other player in the room
    client.to(room).emit('move', move);
  }

  @SubscribeMessage('sendMessage')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ): Promise<void> {
    const { roomId, message } = data;
  
    if (!this.rooms.has(roomId)) {
      console.error(`Room ${roomId} does not exist.`);
      return;
    }
  
    // Log the incoming message and room ID
    console.log(`Received message from ${client.data.username} in room ${roomId}: ${message}`);
  
    // Emit the message to all clients in the room
    client.to(roomId).emit('receiveMessage', {
      username: client.data.username || 'Anonymous',
      message,
    });
  
    // Log the emission of the message
    console.log(`Message sent in room ${roomId}:`, message);
    console.log(`Current players in room ${roomId}:`, this.rooms.get(roomId).players);
  }
}