import { ConfigService } from '@nestjs/config';
import { CRYPT_SALT_ROUNDS, RADIX } from './auth.constants';
import { ICryptOptions } from '../crypt/crypt.interface';

export default function getAuthCryptConfig(configService: ConfigService): ICryptOptions {
  return {
    saltOrRounds: parseInt(configService.get(CRYPT_SALT_ROUNDS), RADIX),
  };
}
