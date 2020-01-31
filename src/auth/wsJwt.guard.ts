import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Next } from '@nestjs/common';
/*
    Custom imports for AuthService, jwt secret, etc...
*/
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';
import { Socket, Server } from 'socket.io';
import { WebSocketServer, WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  @WebSocketServer() wss: Server;
  constructor() { }

  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();
    const authToken: string = client.handshake.query && client.handshake.query.token
    try {
      const jwtPayload = await jwt.verify(authToken, jwtConstants.secret);
      return Boolean(jwtPayload)
    } catch (error) {
      client.emit('chatToServer', new WsException(error.message));
    }
  }
}