import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthInfo, IJwtPayload } from '../auth.interface';
import { JWT_SECRET, MILLIS_IN_SECOND } from '../configs/auth.constants';
import { BAD_TOKEN_ERROR, TOKEN_EXPIRED_ERROR, USER_NOT_ACTIVATED_ERROR } from '../auth.errors';
import AuthService from '../auth.service';
import { USER_NOT_FOUND_ERROR } from '../user/user.errors';

@Injectable()
export default class JwtCommonStrategy extends PassportStrategy(Strategy, 'jwt-common') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload): Promise<IAuthInfo> {
    if (!payload) {
      throw new BadRequestException(BAD_TOKEN_ERROR);
    }
    if (!payload.isActivated) {
      throw new ForbiddenException(USER_NOT_ACTIVATED_ERROR);
    }
    if (payload.isRefreshToken) {
      throw new ForbiddenException(BAD_TOKEN_ERROR);
    }
    const userUpdatedAt = await this.authService.getLastUpdateDate(payload.userId);
    if (!userUpdatedAt) {
      throw new ForbiddenException(USER_NOT_FOUND_ERROR);
    }
    const createdAt = new Date(payload.iat * MILLIS_IN_SECOND);
    if (userUpdatedAt > createdAt) {
      throw new ForbiddenException(TOKEN_EXPIRED_ERROR);
    }

    return {
      userId: payload.userId,
      email: payload.email,
      isActivated: payload.isActivated,
    };
  }
}
