import { Module } from '@nestjs/common';
import FriendListService from './friend-list.service';
import FriendListController from './friend-list.controller';

@Module({
  controllers: [FriendListController],
  providers: [FriendListService],
})
export default class FriendListModule {}
