/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer()
  server: Server;

  private rooms: Record<string, number> = {};

  @SubscribeMessage('deleteSession')
  handleDeleteSession(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    this.server.to(roomId).emit('sessionDeleted');
    client.leave(roomId);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(@ConnectedSocket() client: Socket): void {
    const roomId = uuidv4();
    this.rooms[roomId] = 1; 
    client.join(roomId);
    this.server.to(roomId).emit('roomCreated', { roomId });
  }


  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket): void{
    const { roomId } = data;
    if(this.rooms[roomId] && this.rooms[roomId] < 2){
      this.rooms[roomId] += 1;
      client.join(roomId);
      this.server.to(roomId).emit('userJoined', { roomId });
    } else {
      client.emit('roomFull', { roomId });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data : { roomId: string} , @ConnectedSocket() client : Socket) : void{
      const { roomId } = data;
      if(this.rooms[roomId] ){
        this.rooms[roomId] -= 1;
        if(this.rooms[roomId] === 0){
          delete this.rooms[roomId];
        }
      }
      client.leave(roomId);
  }
}
