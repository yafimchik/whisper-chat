import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { DEFAULT_ACCESS_LIFE_TIME, JWT_ACCESS_LIFE_TIME, JWT_SECRET } from './auth.constants';
import JwtSecretNotFoundError from '../errors/jwt-secret-not-found.error';

export default function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  const secret = configService.get(JWT_SECRET);
  if (!secret) throw new JwtSecretNotFoundError();
  const expiresIn = configService.get(JWT_ACCESS_LIFE_TIME) ?? DEFAULT_ACCESS_LIFE_TIME;
  return {
    secret,
    signOptions: {
      expiresIn,
    },
  };
}
