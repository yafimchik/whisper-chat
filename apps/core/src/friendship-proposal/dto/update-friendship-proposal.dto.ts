import { PartialType } from '@nestjs/mapped-types';
import CreateFriendshipProposalDto from './create-friendship-proposal.dto';

export default class UpdateFriendshipProposalDto extends PartialType(CreateFriendshipProposalDto) {}
