import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes, BadRequestException, UseGuards, NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dto/create-user.dto';
import { USER_NOT_FOUND_ERROR, USER_NOT_UNIQUE_ERROR } from './user.errors';
import JwtCommonGuard from '../guards/jwt-common.guard';
import { ISecuredUser } from './user.interface';
import UpdateUserDto from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtCommonGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ISecuredUser> {
    const userWithSameEmail = await this.userService.findByEmail(createUserDto.email);
    if (userWithSameEmail) {
      throw new BadRequestException(USER_NOT_UNIQUE_ERROR)
    }
    const newUser = await this.userService.create(createUserDto);
    return newUser.getSecuredUser();
  }

  @UseGuards(JwtCommonGuard)
  @Get()
  async findAll(): Promise<ISecuredUser[]> {
    const users = await this.userService.findAll();
    return users.map((user) => user.getSecuredUser());
  }

  @UseGuards(JwtCommonGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ISecuredUser> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return user.getSecuredUser();
  }

  @UseGuards(JwtCommonGuard)
  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<ISecuredUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return user.getSecuredUser();
  }

  @UseGuards(JwtCommonGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async update(
    @Param('id') id: string, @Body() updateUserDto: UpdateUserDto,
  ): Promise<ISecuredUser> {
    const updated = await this.userService.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return updated.getSecuredUser();
  }

  @UseGuards(JwtCommonGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ISecuredUser> {
    const deletedUser = await this.userService.remove(id);
    if (!deletedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return deletedUser.getSecuredUser();
  }
}
