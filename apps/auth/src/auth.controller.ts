import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post, UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import AuthService from './auth.service';
import RegisterUserDto from './dto/user-register.dto';
import { IActivationResult, IAuthInfo, IJwtAccess } from './auth.interface';
import { USER_NOT_UNIQUE_ERROR } from './user/user.errors';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import LocalGuard from './guards/local.guard';
import { USER_NOT_ACTIVATED_ERROR } from './auth.errors';
import { AuthInfo } from '../decorators/auth-info.decorator';
import { ISecuredUser } from './user/user.interface';

@Controller()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userCredentials: RegisterUserDto,
  ): Promise<ISecuredUser> {
    const user = await this.authService.register(userCredentials);
    if (!user) {
      throw new BadRequestException(USER_NOT_UNIQUE_ERROR);
    }

    return user.getSecuredUser();
  }

  @Get('activation/by-user/:userId/code/:activationCode')
  async activate(
    @Param('userId') userId: string,
    @Param('activationCode') activationCode: string,
  ): Promise<IActivationResult> {
    // TODO redirect to activation page
    return {
      isActivated: await this.authService.activate(userId, activationCode),
    };
  }

  @UseGuards(LocalGuard)
  @Post('activation/send-email')
  async sendEmail(@AuthInfo() authInfo: IAuthInfo) {
    if (authInfo.isActivated) return {
      // TODO handling rejecting
    }
    return this.authService.sendActivationEmail(authInfo.email);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @Body() userCredentials: RegisterUserDto,
    @AuthInfo() authInfo: IAuthInfo,
  ): Promise<IJwtAccess> {
    if (!authInfo.isActivated) {
      throw new UnauthorizedException(USER_NOT_ACTIVATED_ERROR);
      // TODO redirect to page with activation
    }
    return this.authService.generateTokens(authInfo);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-tokens')
  async refreshToken(@AuthInfo() authInfo: IAuthInfo): Promise<IJwtAccess> {
    return this.authService.generateTokens(authInfo);
  }
}
