import { Test, TestingModule } from '@nestjs/testing';
import FriendshipProposalController from './friendship-proposal.controller';
import FriendshipProposalService from './friendship-proposal.service';

describe('FriendshipProposalController', () => {
  let controller: FriendshipProposalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipProposalController],
      providers: [FriendshipProposalService],
    }).compile();

    controller = module.get<FriendshipProposalController>(FriendshipProposalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
