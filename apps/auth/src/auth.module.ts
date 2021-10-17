import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import CryptService from './crypt/crypt.service';
import CryptModule from './crypt/crypt.module';
import getAuthMongodbConfig from './configs/mongodb.config';
import getAuthCryptConfig from './configs/crypt.config';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getAuthMongodbConfig,
    }),
    CryptModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getAuthCryptConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CryptService],
})
export default class AuthModule {}
