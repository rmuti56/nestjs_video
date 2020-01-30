import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { jwtConstants } from 'src/auth/constants';
import { WsJwtGuard } from 'src/auth/wsJwt.guard';

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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('chatToServer') //แบบสร้างห้อง
  handleMessage(client: Socket, message: {
    sendFrom: string,
    sendTo: string,
    sender: string,
    room: string,
    message: string,
    user: any
  }) {
    if (message.sendTo === message.sendFrom) {
      this.wss.to(message.sendTo).emit('chatToServer', message);
    } else {
      this.wss.to(message.sendTo).emit('chatToServer', message);
      this.wss.to(message.sendFrom).emit('chatToServer', message);
    }
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
