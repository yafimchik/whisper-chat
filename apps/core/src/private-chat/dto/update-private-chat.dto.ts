import { PartialType } from '@nestjs/mapped-types';
import CreatePrivateChatDto from './create-private-chat.dto';

export default class UpdatePrivateChatDto extends PartialType(CreatePrivateChatDto) {}
