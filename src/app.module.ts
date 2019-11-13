import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [TypeOrmModule.forRoot(),
  MulterModule.register({
    dest: './files',
  }),
    AuthModule, UsersModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
