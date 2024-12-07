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

  private rooms: Record<string, number> = {};
  private clientRooms: Record<string, string> = {};
  private clientColors: Record<string, string> = {};

  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket): void {
    // Check if client is already in a room
    if (this.clientRooms[client.id]) {
      const roomId = this.clientRooms[client.id];
      console.log(`Client already has a room: ${roomId}`);
      client.emit('roomCreated', { roomId });
      client.emit('assignColor', this.clientColors[client.id]);
      return;
    }

    const roomId = uuidv4();
    this.rooms[roomId] = 1;
    this.clientRooms[client.id] = roomId;
    this.clientColors[client.id] = 'w';

    client.join(roomId);
    console.log(`Room created: ${roomId}, Host joined`);
    console.log('Rooms state:', this.rooms);

    client.emit('roomCreated', { roomId });
    client.emit('assignColor', 'w');
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;

    // If client is already in this room, just reassign their color
    if (this.clientRooms[client.id] === roomId) {
      console.log(`Client already in room: ${roomId}`);
      client.emit('assignColor', this.clientColors[client.id]);
      return;
    }

    if (!this.rooms[roomId]) {
      console.log(`Room does not exist: ${roomId}`);
      client.emit('roomFull', { roomId });
      return;
    }

    if (this.rooms[roomId] >= 2) {
      console.log(`Room full: ${roomId}`);
      client.emit('roomFull', { roomId });
      return;
    }

    // Clean up old room if client was in one
    if (this.clientRooms[client.id]) {
      this.handleLeaveRoom({ roomId: this.clientRooms[client.id] }, client);
    }

    this.rooms[roomId] += 1;
    this.clientRooms[client.id] = roomId;
    const color = this.rooms[roomId] === 2 ? 'b' : 'w';
    this.clientColors[client.id] = color;

    client.join(roomId);
    console.log(`User joined room: ${roomId}, Users: ${this.rooms[roomId]}`);
    
    this.server.to(roomId).emit('userJoined', { roomId });
    client.emit('assignColor', color);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;

    if (this.rooms[roomId]) {
      this.rooms[roomId] -= 1;

      if (this.rooms[roomId] === 0) {
        delete this.rooms[roomId];
        console.log(`Room deleted: ${roomId}`);
        this.server.to(roomId).emit('notEnoughPlayers', { roomId });
      }
    }

    delete this.clientColors[client.id];
    delete this.clientRooms[client.id];
    client.leave(roomId);
    console.log(`User left room: ${roomId}`);
    console.log('Rooms state:', this.rooms);
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;

    if (!this.rooms[roomId] || this.rooms[roomId] < 2) {
      console.log(`Not enough players to start the game in room: ${roomId}`);
      client.emit('notEnoughPlayers', { roomId });
      return;
    }

    this.server.to(roomId).emit('gameStarted', { roomId });
    console.log(`Game started in room: ${roomId}`);
  }

  @SubscribeMessage('gameStarted')
  handleGameStarted(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    this.server.to(roomId).emit('gameStarted', { roomId });
    console.log(`Notified players that game started in room: ${roomId}`);
  }

  @SubscribeMessage('notEnoughPlayers')
  handleNotEnoughPlayers(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    client.emit('notEnoughPlayers', { roomId });
    console.log(`Not enough players in room: ${roomId}`);
  }
}
