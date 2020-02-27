import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    GoogleStrategy,
    GithubStrategy],
  exports: [AuthService]
})
export class AuthModule { }
