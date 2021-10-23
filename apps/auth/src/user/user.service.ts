import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import CreateUserDto from './dto/create-user.dto';
import { UserModel, DbModelUser } from './user.model';
import UpdateUserDto from './dto/update-user.dto';
import CryptService from '../crypt/crypt.service';
import { IUser, IUserUpdate } from './user.interface';
import UserEntity from './entities/user.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModelConstructor: DbModelUser,
    private readonly cryptService: CryptService,
  ) {}

  async create({ email, password }: CreateUserDto): Promise<IUser> {
    const passwordHash = await this.cryptService.getHash(password);
    const newUser = new this.UserModelConstructor({ email, passwordHash });
    const result = await newUser.save();

    return result ? new UserEntity(newUser) : null;
  }

  async findAll(): Promise<IUser[]> {
    const dbUsers = await this.UserModelConstructor.find().exec();
    return dbUsers.map((dbUser) => new UserEntity(dbUser));
  }

  async findOne(id: string): Promise<IUser> {
    const dbUser = await this.UserModelConstructor.findById(id).exec();
    return dbUser ? new UserEntity(dbUser) : null;
  }

  async findByEmail(email: string): Promise<IUser> {
    const dbUser = await this.UserModelConstructor.findOne({ email }).exec();
    return dbUser ? new UserEntity(dbUser) : null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const userDoc: IUserUpdate = {};

    if (updateUserDto.email) {
      userDoc.email = updateUserDto.email;
    }
    if (updateUserDto.activationCode) {
      userDoc.activationCodeHash = await this.cryptService.getHash(updateUserDto.activationCode);
    }
    if (updateUserDto.password) {
      userDoc.passwordHash = await this.cryptService.getHash(updateUserDto.password);
    }
    if (updateUserDto.isActivated) {
      userDoc.isActivated = !!updateUserDto.isActivated;
    }

    const dbUser = await this.UserModelConstructor.findByIdAndUpdate(id, userDoc, {
      new: true,
    }).exec();
    return dbUser ? new UserEntity(dbUser) : null;
  }

  async remove(id: string): Promise<IUser> {
    const dbUser = await this.UserModelConstructor.findByIdAndRemove(id).exec();
    return dbUser ? new UserEntity(dbUser) : null;
  }
}
