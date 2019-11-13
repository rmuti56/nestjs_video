import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ExtractJwt, Strategy, } from 'passport-jwt';
import { PassportStrategy, } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { Socket, Server, } from 'socket.io';
import { parse } from 'url';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {

    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username }
  }
}