import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [],
  providers: [ChatGateway, ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule { }
