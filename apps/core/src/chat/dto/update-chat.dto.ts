import { PartialType } from '@nestjs/mapped-types';
import CreateChatDto from './create-chat.dto';

export default class UpdateChatDto extends PartialType(CreateChatDto) {}
