import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrivateChatModule } from './private-chat/private-chat.module';
import { UserInfoModule } from './user-info/user-info.module';
import { FriendListModule } from './friend-list/friend-list.module';
import { FriendshipProposalModule } from './friendship-proposal/friendship-proposal.module';
import AppController from './app.controller';
import AppService from './app.service';

@Module({
  imports: [ChatModule, PrivateChatModule, UserInfoModule, FriendListModule, FriendshipProposalModule],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
