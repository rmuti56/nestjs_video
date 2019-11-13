import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initalized!');
  }

  // @SubscribeMessage('chatToServer') //แบบทุก client
  // handleMessage(client: Socket, message: { sender: string, message: string }) {
  //   this.wss.emit('chatToServer', message);
  // }  

  @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('chatToServer') //แบบสร้างห้อง
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('chatToServer', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  sendChat(msg: string) {
    this.wss.emit('chatToServer', { sender: 'string', message: msg })
  }
}
