import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import FriendshipProposalService from './friendship-proposal.service';
import CreateFriendshipProposalDto from './dto/create-friendship-proposal.dto';
import UpdateFriendshipProposalDto from './dto/update-friendship-proposal.dto';

@Controller('friendship-proposal')
export default class FriendshipProposalController {
  constructor(private readonly friendshipProposalService: FriendshipProposalService) {}

  @Post()
  create(@Body() createFriendshipProposalDto: CreateFriendshipProposalDto) {
    return this.friendshipProposalService.create(createFriendshipProposalDto);
  }

  @Get()
  findAll() {
    return this.friendshipProposalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendshipProposalService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFriendshipProposalDto: UpdateFriendshipProposalDto,
  ) {
    return this.friendshipProposalService.update(+id, updateFriendshipProposalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendshipProposalService.remove(+id);
  }
}
