import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthInfo, IJwtPayload } from '../auth.interface';
import { JWT_SECRET } from '../configs/auth.constants';
import { BAD_TOKEN_ERROR, USER_NOT_ACTIVATED_ERROR } from '../auth.errors';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  validate(payload: IJwtPayload): IAuthInfo {
    if (!payload) {
      throw new UnauthorizedException(BAD_TOKEN_ERROR);
    }
    if (!payload.isActivated) {
      throw new UnauthorizedException(USER_NOT_ACTIVATED_ERROR);
    }
    if (!payload.isRefreshToken) {
      throw new UnauthorizedException(BAD_TOKEN_ERROR);
    }
    delete payload.isRefreshToken;
    return payload;
  }
}
