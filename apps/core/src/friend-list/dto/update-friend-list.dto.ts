import { PartialType } from '@nestjs/mapped-types';
import CreateFriendListDto from './create-friend-list.dto';

export default class UpdateFriendListDto extends PartialType(CreateFriendListDto) {}
