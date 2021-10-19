import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import CryptModule from './crypt/crypt.module';
import getAuthMongodbConfig from './configs/mongodb.config';
import getAuthCryptConfig from './configs/crypt.config';
import { JwtModule } from '@nestjs/jwt';
import getJwtConfig from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user/user.service';
import UserModel from './user/user.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getAuthMongodbConfig,
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: { collection: 'User' },
      },
    ]),
    CryptModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getAuthCryptConfig,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
  ],
  exports: [AuthService],
})
export default class AuthModule {}
