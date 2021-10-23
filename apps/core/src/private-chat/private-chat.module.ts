import { Module } from '@nestjs/common';
import PrivateChatService from './private-chat.service';
import PrivateChatController from './private-chat.controller';

@Module({
  controllers: [PrivateChatController],
  providers: [PrivateChatService],
})
export default class PrivateChatModule {}
