import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthInfo, IJwtPayload } from '../auth.interface';
import { JWT_SECRET } from '../configs/auth.constants';
import { BAD_TOKEN_ERROR, USER_NOT_ACTIVATED_ERROR } from '../auth.errors';
import AuthService from '../auth.service';
import checkUserChanges from './jwt.strategy.utils';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly checkUserChanges: (payload: IJwtPayload) => Promise<void>;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_SECRET),
    });
    this.checkUserChanges = checkUserChanges.bind(this);
  }

  async validate(payload: IJwtPayload): Promise<IAuthInfo> {
    if (!payload.isActivated) {
      throw new ForbiddenException(USER_NOT_ACTIVATED_ERROR);
    }
    if (!payload.isRefreshToken) {
      throw new ForbiddenException(BAD_TOKEN_ERROR);
    }

    await this.checkUserChanges(payload);

    return {
      userId: payload.userId,
      email: payload.email,
      isActivated: payload.isActivated,
    };
  }
}
