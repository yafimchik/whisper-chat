import { Injectable } from '@nestjs/common';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';
import { UpdatePrivateChatDto } from './dto/update-private-chat.dto';

@Injectable()
export class PrivateChatService {
  create(createPrivateChatDto: CreatePrivateChatDto) {
    return 'This action adds a new privateChat';
  }

  findAll() {
    return `This action returns all privateChat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} privateChat`;
  }

  update(id: number, updatePrivateChatDto: UpdatePrivateChatDto) {
    return `This action updates a #${id} privateChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} privateChat`;
  }
}
