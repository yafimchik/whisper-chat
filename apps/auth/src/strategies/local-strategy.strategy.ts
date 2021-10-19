import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from '../auth.service';
import { IAuthInfo } from '../auth.interface';
import { BAD_CREDENTIALS_ERROR } from '../auth.errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<IAuthInfo> {
    const user = await this.authService.validate({ email, password });
    if (!user) {
      throw new UnauthorizedException(BAD_CREDENTIALS_ERROR);
    }

    return {
      email,
      isActivated: user.isActivated,
      userId: user._id.toString(),
    };
  }
}
