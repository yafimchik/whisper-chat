import { Module } from '@nestjs/common';
import { FriendshipProposalService } from './friendship-proposal.service';
import { FriendshipProposalController } from './friendship-proposal.controller';

@Module({
  controllers: [FriendshipProposalController],
  providers: [FriendshipProposalService]
})
export class FriendshipProposalModule {}
