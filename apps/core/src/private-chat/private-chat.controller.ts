import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrivateChatService } from './private-chat.service';
import { CreatePrivateChatDto } from './dto/create-private-chat.dto';
import { UpdatePrivateChatDto } from './dto/update-private-chat.dto';

@Controller('private-chat')
export class PrivateChatController {
  constructor(private readonly privateChatService: PrivateChatService) {}

  @Post()
  create(@Body() createPrivateChatDto: CreatePrivateChatDto) {
    return this.privateChatService.create(createPrivateChatDto);
  }

  @Get()
  findAll() {
    return this.privateChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.privateChatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrivateChatDto: UpdatePrivateChatDto) {
    return this.privateChatService.update(+id, updatePrivateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.privateChatService.remove(+id);
  }
}
