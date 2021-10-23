import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import UserService from './user.service';
import UserController from './user.controller';
import { UserModel } from './user.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: { collection: 'User', timestamps: true },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
