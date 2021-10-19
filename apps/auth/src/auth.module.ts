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
import { JwtModule, JwtService } from '@nestjs/jwt';
import getJwtConfig from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptService,
    JwtService,
  ],
  exports: [AuthService],
})
export default class AuthModule {}
