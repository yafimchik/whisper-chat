import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipProposalService } from './friendship-proposal.service';

describe('FriendshipProposalService', () => {
  let service: FriendshipProposalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendshipProposalService],
    }).compile();

    service = module.get<FriendshipProposalService>(FriendshipProposalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
