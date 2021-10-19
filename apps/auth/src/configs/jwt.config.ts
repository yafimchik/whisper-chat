import { ConfigService } from '@nestjs/config';
import { JWT_ACCESS_LIFE_TIME, JWT_SECRET } from './auth.constants';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

export default function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.get(JWT_SECRET),
    signOptions: { expiresIn: JWT_ACCESS_LIFE_TIME },
  };
}
