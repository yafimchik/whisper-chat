import { Injectable } from '@nestjs/common';
import CreateFriendshipProposalDto from './dto/create-friendship-proposal.dto';
import UpdateFriendshipProposalDto from './dto/update-friendship-proposal.dto';

@Injectable()
export default class FriendshipProposalService {
  create(createFriendshipProposalDto: CreateFriendshipProposalDto) {
    return 'This action adds a new friendshipProposal';
  }

  findAll() {
    return `This action returns all friendshipProposal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friendshipProposal`;
  }

  update(id: number, updateFriendshipProposalDto: UpdateFriendshipProposalDto) {
    return `This action updates a #${id} friendshipProposal`;
  }

  remove(id: number) {
    return `This action removes a #${id} friendshipProposal`;
  }
}
