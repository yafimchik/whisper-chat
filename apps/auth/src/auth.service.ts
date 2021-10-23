import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { add as addToDate } from 'date-fns';
import { v4 as uuid } from 'uuid';
import UserService from './user/user.service';
import RegisterUserDto from './dto/user-register.dto';
import CryptService from './crypt/crypt.service';
import { IAuthInfo, IJwtAccess, IJwtPayload } from './auth.interface';
import { IUser } from './user/user.interface';
import { getSecondsFromLifeTimeString } from './utils/utils';
import {
  DEFAULT_ACCESS_LIFE_TIME,
  DEFAULT_REFRESH_LIFE_TIME,
  JWT_ACCESS_LIFE_TIME,
  JWT_REFRESH_LIFE_TIME,
} from './configs/auth.constants';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(CryptService) private readonly cryptService: CryptService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async validate({ email, password }: RegisterUserDto): Promise<IUser> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    return (await this.cryptService.compare(password, user.passwordHash)) ? user : null;
  }

  async getLastUpdateDate(id: string): Promise<Date> {
    const user = await this.userService.findOne(id);
    return user ? user.updatedAt : null;
  }

  async register(createUserDto: RegisterUserDto): Promise<IUser> {
    const existedUser = await this.userService.findByEmail(createUserDto.email);
    if (existedUser) return null;
    const newUser = await this.userService.create(createUserDto);
    const activationCode = await this.createActivationCode(newUser);

    if (activationCode) {
      await this.sendActivationEmail(newUser, activationCode);
    }

    return newUser;
  }

  async generateTokens(authInfo: IAuthInfo): Promise<IJwtAccess> {
    const currentDate = new Date();

    const accessLifeTime = this.configService.get(JWT_ACCESS_LIFE_TIME) ?? DEFAULT_ACCESS_LIFE_TIME;
    const refreshLifeTime =
      this.configService.get(JWT_REFRESH_LIFE_TIME) ?? DEFAULT_REFRESH_LIFE_TIME;

    const refreshBefore = AuthService.getTokenExpireDate(currentDate, accessLifeTime).toJSON();
    const expiresAfter = AuthService.getTokenExpireDate(currentDate, refreshLifeTime).toJSON();

    const refreshPayload: IJwtPayload = { ...authInfo, isRefreshToken: true };

    return {
      access_token: await this.jwtService.signAsync(authInfo),
      refresh_token: await this.jwtService.signAsync(refreshPayload, {
        expiresIn: refreshLifeTime,
      }),
      expires_after: expiresAfter,
      refresh_before: refreshBefore,
    };
  }

  async activate(userId: string, activationCode: string): Promise<boolean> {
    const user = await this.userService.findOne(userId);
    if (!user) return false;
    if (user.isActivated) return true;

    if (!(await this.cryptService.compare(activationCode, user.activationCodeHash))) {
      return false;
    }

    const result = await this.userService.update(user._id, { isActivated: true });
    return !!result;
  }

  private async createActivationCode(user: IUser): Promise<string> {
    if (user.isActivated) return null;
    const activationCode = uuid();
    const updated = await this.userService.update(user._id, { activationCode });

    return updated ? activationCode : null;
  }

  async sendActivationEmail(
    userOrEmail: IUser | string,
    activationCode?: string,
  ): Promise<boolean | string> {
    let user: IUser;
    if (typeof userOrEmail === 'string') {
      user = await this.userService.findByEmail(userOrEmail);
    } else {
      user = userOrEmail;
    }

    if (user.isActivated) return false;

    const newActivationCode = activationCode ?? (await this.createActivationCode(user));

    // TODO sending of email with activation link
    return `/activation/by-user/${user._id}/code/${newActivationCode}`;
    // return true;
  }

  private static getTokenExpireDate(creationDate: Date = new Date(), lifeTimeString: string): Date {
    const seconds = getSecondsFromLifeTimeString(lifeTimeString);
    return addToDate(creationDate, { seconds });
  }
}
