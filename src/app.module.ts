import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadS3Module } from './image-upload-s3/image-upload-s3.module';

@Module({
  imports: [TypeOrmModule.forRoot(),
  MulterModule.register({
    dest: './files',
  }),
    AuthModule, UsersModule, ChatModule, ImageUploadS3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
